# RAG Architecture Document
## KidSpark - Retrieval-Augmented Generation Implementation

**Version:** 1.0  
**Date:** February 18, 2026  
**Purpose:** Technical specification for AI/RAG system

---

## Table of Contents
1. [RAG System Overview](#1-rag-system-overview)
2. [Architecture Components](#2-architecture-components)
3. [Content Ingestion Pipeline](#3-content-ingestion-pipeline)
4. [Query Processing Flow](#4-query-processing-flow)
5. [Safety & Guardrails](#5-safety--guardrails)
6. [LLM Configuration](#6-llm-configuration)
7. [Vector Database Design](#7-vector-database-design)
8. [Prompt Engineering](#8-prompt-engineering)
9. [Performance Optimization](#9-performance-optimization)
10. [Monitoring & Logging](#10-monitoring--logging)

---

## 1. RAG System Overview

### 1.1 RAG Purpose in KidSpark

**Core Objective:** Provide parent-mediated explanations of Std 1 curriculum concepts using **only** approved educational content.

**Design Principles:**
1. **Grounded Responses**: Every answer sourced from indexed textbooks
2. **No Hallucination**: If information not in knowledge base, explicitly say so
3. **Transparent Attribution**: Every response cites source (book, chapter, page)
4. **Parent-Mediated**: No direct child access to AI
5. **Explainable**: RAG retrieval process auditable

**NOT an Interactive Tutor:**
- Does not assess homework correctness
- Does not provide homework solutions
- Does not chat conversationally about non-curriculum topics
- Does not make predictions or recommendations

### 1.2 Use Cases

**Supported:**
```
✓ "What is the /sh/ sound in phonics?"
✓ "How do I explain addition to my 6-year-old?"
✓ "What are CVC words?"
✓ "Which page has shape examples?"
✓ "What's the difference between 'b' and 'd' letters?"
```

**Blocked:**
```
✗ "Solve this math problem: 5 + 3 = ?"
✗ "Is my child's answer correct?"
✗ "What grade should my child get?"
✗ "How does my child compare to others?"
✗ "Tell me a story about dinosaurs" (not in Std 1 scope)
```

---

## 2. Architecture Components

### 2.1 High-Level Architecture

```
┌───────────────────────────────────────────────────────────┐
│                    KIDSPARK APPLICATION                    │
└───────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│                     API GATEWAY                            │
│  (Authentication, Rate Limiting, Request Validation)       │
└───────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│                   AI HELPER SERVICE                        │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Query Preprocessor                                 │  │
│  │  • Spell check                                      │  │
│  │  • Subject classification                           │  │
│  │  • Intent detection                                 │  │
│  │  • Safety filter (pre-check)                       │  │
│  └─────────────────────────────────────────────────────┘  │
│                         ▼                                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  RAG Orchestrator                                   │  │
│  │  • Query embedding                                  │  │
│  │  • Vector search                                    │  │
│  │  • Context ranking                                  │  │
│  │  • Prompt construction                              │  │
│  └─────────────────────────────────────────────────────┘  │
│                         ▼                                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  LLM Integration                                    │  │
│  │  • Prompt execution                                 │  │
│  │  • Response generation                              │  │
│  │  • Token management                                 │  │
│  └─────────────────────────────────────────────────────┘  │
│                         ▼                                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Response Post-Processor                            │  │
│  │  • Citation formatting                              │  │
│  │  • Safety filter (post-check)                       │  │
│  │  • Readability check                                │  │
│  │  • Logging                                          │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
            │                                    │
            ▼                                    ▼
┌─────────────────────────┐       ┌─────────────────────────┐
│   VECTOR DATABASE       │       │   PRIMARY DATABASE      │
│   (Pinecone/Weaviate)   │       │   (PostgreSQL)          │
│                         │       │                         │
│ • Textbook embeddings   │       │ • User queries          │
│ • Metadata              │       │ • AI responses          │
│ • Concept index         │       │ • Feedback logs         │
└─────────────────────────┘       └─────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│            CONTENT INGESTION PIPELINE                      │
│  (Offline process - runs when curriculum updated)          │
│                                                            │
│  PDF/Image → Text Extraction → Chunking → Embedding →     │
│  → Vector DB Storage                                       │
└───────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

| Component | Technology Options | Recommendation |
|-----------|-------------------|----------------|
| **LLM** | OpenAI GPT-4, Anthropic Claude, Llama 2 13B, Mistral 7B | **Llama 2 13B** (self-hosted for privacy) |
| **Embedding Model** | OpenAI ada-002, sentence-transformers | **sentence-transformers/all-MiniLM-L6-v2** (fast, open-source) |
| **Vector DB** | Pinecone, Weaviate, Qdrant, Milvus | **Weaviate** (open-source, self-hosted) |
| **Orchestration** | LangChain, LlamaIndex | **LangChain** (mature ecosystem) |
| **Backend** | Python FastAPI, Node.js | **Python FastAPI** (AI/ML ecosystem) |
| **OCR** | Tesseract, AWS Textract, Google Vision | **Tesseract** (open-source, sufficient for textbooks) |

---

## 3. Content Ingestion Pipeline

### 3.1 Textbook Digitization Process

**Input:** PDF textbooks (English Std 1, Math Std 1)

**Step 1: PDF Parsing**
```python
from PyPDF2 import PdfReader
import pytesseract
from PIL import Image

def extract_text_from_pdf(pdf_path):
    """
    Extract text from PDF, handling both digital and scanned pages
    """
    reader = PdfReader(pdf_path)
    extracted_pages = []
    
    for page_num, page in enumerate(reader.pages, start=1):
        # Try direct text extraction first
        text = page.extract_text()
        
        # If minimal text, assume scanned image - use OCR
        if len(text.strip()) < 50:
            # Convert page to image
            img = convert_pdf_page_to_image(page)
            text = pytesseract.image_to_string(img, lang='eng')
        
        extracted_pages.append({
            'page_number': page_num,
            'text': text,
            'word_count': len(text.split())
        })
    
    return extracted_pages
```

**Step 2: Metadata Enrichment**
```python
def enrich_with_metadata(extracted_pages, book_metadata):
    """
    Add book-level and page-level metadata
    """
    enriched = []
    
    for page_data in extracted_pages:
        page_data['book_title'] = book_metadata['title']
        page_data['subject'] = book_metadata['subject']  # 'English' or 'Math'
        page_data['grade'] = 'Std 1'
        page_data['language'] = 'English'
        
        # Extract chapter info from page content if present
        chapter_info = detect_chapter(page_data['text'])
        page_data['chapter'] = chapter_info
        
        enriched.append(page_data)
    
    return enriched
```

**Step 3: Intelligent Chunking**

**Chunking Strategy:**
- **Page-Level Chunks**: Full page content (for direct citation)
- **Concept-Level Chunks**: Paragraphs/sections about specific topics
- **Example-Level Chunks**: Individual examples, practice problems

```python
def chunk_textbook_content(enriched_pages):
    """
    Create multiple granularity chunks
    """
    chunks = []
    
    for page in enriched_pages:
        # Page-level chunk (for citation)
        chunks.append({
            'chunk_type': 'page',
            'chunk_id': f"{page['book_title']}_p{page['page_number']}",
            'text': page['text'],
            'metadata': {
                'book': page['book_title'],
                'subject': page['subject'],
                'page': page['page_number'],
                'chapter': page['chapter'],
                'granularity': 'page'
            }
        })
        
        # Concept-level chunks (semantic sections)
        concepts = split_into_concepts(page['text'])
        for idx, concept in enumerate(concepts):
            chunks.append({
                'chunk_type': 'concept',
                'chunk_id': f"{page['book_title']}_p{page['page_number']}_c{idx}",
                'text': concept['text'],
                'metadata': {
                    'book': page['book_title'],
                    'subject': page['subject'],
                    'page': page['page_number'],
                    'chapter': page['chapter'],
                    'concept_title': concept['title'],
                    'granularity': 'concept'
                }
            })
        
        # Example-level chunks
        examples = extract_examples(page['text'], page['subject'])
        for idx, example in enumerate(examples):
            chunks.append({
                'chunk_type': 'example',
                'chunk_id': f"{page['book_title']}_p{page['page_number']}_e{idx}",
                'text': example,
                'metadata': {
                    'book': page['book_title'],
                    'subject': page['subject'],
                    'page': page['page_number'],
                    'granularity': 'example'
                }
            })
    
    return chunks
```

**Step 4: Embedding Generation**
```python
from sentence_transformers import SentenceTransformer

def generate_embeddings(chunks):
    """
    Generate vector embeddings for all chunks
    """
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    
    for chunk in chunks:
        # Generate embedding
        embedding = model.encode(chunk['text'])
        chunk['embedding'] = embedding.tolist()
    
    return chunks
```

**Step 5: Vector Database Storage**
```python
import weaviate

def store_in_vector_db(chunks):
    """
    Store chunks with embeddings in Weaviate
    """
    client = weaviate.Client("http://localhost:8080")
    
    # Define schema
    schema = {
        "class": "TextbookContent",
        "vectorizer": "none",  # Using pre-computed embeddings
        "properties": [
            {"name": "text", "dataType": ["text"]},
            {"name": "book", "dataType": ["string"]},
            {"name": "subject", "dataType": ["string"]},
            {"name": "page", "dataType": ["int"]},
            {"name": "chapter", "dataType": ["string"]},
            {"name": "granularity", "dataType": ["string"]},
            {"name": "concept_title", "dataType": ["string"]},
        ]
    }
    
    client.schema.create_class(schema)
    
    # Batch insert
    with client.batch as batch:
        for chunk in chunks:
            batch.add_data_object(
                data_object={
                    "text": chunk['text'],
                    **chunk['metadata']
                },
                class_name="TextbookContent",
                vector=chunk['embedding']
            )
```

### 3.2 Content Update Strategy

**Versioning:**
```
textbook_versions:
  - version: "2026_edition"
    english_book_hash: "abc123..."
    math_book_hash: "def456..."
    indexed_date: "2026-02-01"
    active: true
  
  - version: "2025_edition"
    english_book_hash: "xyz789..."
    math_book_hash: "uvw012..."
    indexed_date: "2025-08-01"
    active: false
```

**Update Process:**
1. New curriculum uploaded
2. Ingestion pipeline runs (offline)
3. New version created in vector DB
4. Parallel testing with sample queries
5. Manual QA review
6. Switch active version (zero-downtime)
7. Deprecate old version after 30 days

---

## 4. Query Processing Flow

### 4.1 Query Preprocessing

**Step 1: Input Validation**
```python
def validate_query(query_text, user_id):
    """
    Basic validation before processing
    """
    # Length check
    if len(query_text) < 3:
        return {"valid": False, "error": "Query too short"}
    
    if len(query_text) > 500:
        return {"valid": False, "error": "Query too long (max 500 characters)"}
    
    # Rate limiting check
    if is_rate_limited(user_id):
        return {"valid": False, "error": "Rate limit exceeded (max 20 queries/hour)"}
    
    return {"valid": True}
```

**Step 2: Spell Correction**
```python
from spellchecker import SpellChecker

def correct_spelling(query_text):
    """
    Fix common spelling mistakes
    """
    spell = SpellChecker()
    words = query_text.split()
    corrected_words = []
    
    for word in words:
        # Skip short words and numbers
        if len(word) <= 2 or word.isdigit():
            corrected_words.append(word)
            continue
        
        correction = spell.correction(word)
        corrected_words.append(correction if correction else word)
    
    return ' '.join(corrected_words)
```

**Step 3: Subject Classification**
```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

def classify_subject(query_text):
    """
    Determine if query is about English or Math
    """
    # Pre-trained classifier (trained on sample queries)
    classifier = load_subject_classifier()
    
    subject_probs = classifier.predict_proba([query_text])[0]
    # Returns: {'english': 0.7, 'math': 0.3}
    
    if max(subject_probs) < 0.6:
        return 'unclear'
    
    return 'english' if subject_probs['english'] > subject_probs['math'] else 'math'
```

**Step 4: Intent Detection**
```python
def detect_intent(query_text):
    """
    Classify query intent to apply appropriate guardrails
    """
    intent_patterns = {
        'concept_explanation': [
            r'\bwhat is\b', r'\bwhat are\b', r'\bexplain\b', 
            r'\bhow to explain\b', r'\bmeaning of\b'
        ],
        'homework_solution': [
            r'\bsolve\b', r'\banswer to\b', r'\bwhat is \d+\s*[\+\-\*\/]\s*\d+\b',
            r'\bcomplete\b.*\bhomework\b', r'\bgive me the answer\b'
        ],
        'assessment': [
            r'\bis this correct\b', r'\bgrade\b', r'\bscore\b', 
            r'\bcheck my work\b', r'\bevaluate\b'
        ],
        'navigation': [
            r'\bwhich page\b', r'\bwhere can i find\b', r'\bpage number\b'
        ]
    }
    
    for intent, patterns in intent_patterns.items():
        for pattern in patterns:
            if re.search(pattern, query_text, re.IGNORECASE):
                return intent
    
    return 'concept_explanation'  # Default
```

### 4.2 Safety Filtering (Pre-Retrieval)

```python
def apply_safety_filters(query_text, intent, subject):
    """
    Block queries that violate rules before RAG retrieval
    """
    # Block homework solution requests
    if intent == 'homework_solution':
        return {
            'allowed': False,
            'message': "I can explain concepts, but I can't solve homework for you. "\
                       "Let me explain how to approach this type of question instead."
        }
    
    # Block assessment requests
    if intent == 'assessment':
        return {
            'allowed': False,
            'message': "I cannot assess or grade work. Please submit to your teacher for feedback."
        }
    
    # Block out-of-scope topics
    if subject == 'unclear':
        # Try to detect if clearly non-curriculum
        non_curriculum_keywords = ['movie', 'game', 'youtube', 'toy', 'cartoon', 'superhero']
        if any(keyword in query_text.lower() for keyword in non_curriculum_keywords):
            return {
                'allowed': False,
                'message': "This topic is outside the Std 1 curriculum. "\
                           "I can only help with English and Math from your textbooks."
            }
    
    return {'allowed': True}
```

### 4.3 Vector Search & Retrieval

```python
from sentence_transformers import SentenceTransformer

def retrieve_relevant_chunks(query_text, subject, top_k=5):
    """
    Semantic search in vector database
    """
    # Generate query embedding
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    query_embedding = model.encode(query_text)
    
    # Search in Weaviate
    client = weaviate.Client("http://localhost:8080")
    
    result = client.query.get(
        "TextbookContent",
        ["text", "book", "subject", "page", "chapter", "granularity", "concept_title"]
    ).with_near_vector({
        "vector": query_embedding.tolist()
    }).with_limit(top_k * 2).do()  # Retrieve 2x for filtering
    
    chunks = result['data']['Get']['TextbookContent']
    
    # Filter by subject if classified
    if subject != 'unclear':
        chunks = [c for c in chunks if c['subject'].lower() == subject.lower()]
    
    # Return top_k after filtering
    return chunks[:top_k]
```

### 4.4 Context Ranking

```python
def rank_retrieved_chunks(chunks, query_text):
    """
    Re-rank chunks by relevance and granularity
    """
    # Scoring weights
    weights = {
        'similarity': 0.5,      # Semantic similarity (from vector search)
        'granularity': 0.3,     # Prefer concept > page > example
        'chapter_match': 0.2    # Bonus for chapter keyword match
    }
    
    granularity_scores = {
        'concept': 1.0,
        'page': 0.7,
        'example': 0.5
    }
    
    for chunk in chunks:
        # Similarity score (distance from vector search)
        sim_score = chunk.get('_additional', {}).get('distance', 0.5)
        
        # Granularity score
        gran_score = granularity_scores.get(chunk['granularity'], 0.5)
        
        # Chapter match (bonus if query contains chapter keywords)
        chapter_score = 1.0 if chunk.get('chapter', '').lower() in query_text.lower() else 0.5
        
        # Weighted final score
        chunk['relevance_score'] = (
            weights['similarity'] * sim_score +
            weights['granularity'] * gran_score +
            weights['chapter_match'] * chapter_score
        )
    
    # Sort by relevance
    chunks.sort(key=lambda x: x['relevance_score'], reverse=True)
    
    return chunks[:3]  # Return top 3 for prompt context
```

### 4.5 Prompt Construction

```python
def construct_rag_prompt(query_text, retrieved_chunks):
    """
    Build prompt for LLM with retrieved context
    """
    # System prompt (defines AI role and rules)
    system_prompt = """
You are a helpful learning assistant for Standard 1 (first grade) students and their parents. Your role is to explain curriculum concepts from approved textbooks in simple, parent-friendly language.

RULES:
1. Answer ONLY using the provided context from textbooks
2. If the answer is not in the context, say "I don't have information about that in the Std 1 textbooks"
3. Always cite the source (book name, chapter, page number)
4. Keep language simple and suitable for explaining to a 6-year-old
5. Do NOT solve homework problems - only explain concepts
6. Do NOT assess or grade student work
7. Do NOT provide information outside Std 1 English and Math curriculum
8. Suggest practice activities when appropriate

FORMAT your response as:
- Clear explanation (2-3 sentences)
- Example from the textbook (if available)
- Source citation (book, chapter, page)
- Optional: Practice suggestion
"""
    
    # Context section (retrieved chunks)
    context_text = "\n\n---\n\n".join([
        f"SOURCE: {chunk['book']}, Chapter {chunk.get('chapter', 'N/A')}, Page {chunk['page']}\n"\
        f"CONTENT: {chunk['text']}"
        for chunk in retrieved_chunks
    ])
    
    # User query
    user_prompt = f"""
Based on the textbook content provided, please answer this question:

QUESTION: {query_text}

TEXTBOOK CONTEXT:
{context_text}

Remember to cite your sources and keep the explanation parent-friendly!
"""
    
    return {
        'system': system_prompt,
        'user': user_prompt
    }
```

### 4.6 LLM Response Generation

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

def generate_response(prompts, temperature=0.3):
    """
    Generate response using Llama 2 13B
    """
    model_name = "meta-llama/Llama-2-13b-chat-hf"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float16,
        device_map="auto"
    )
    
    # Format for Llama 2 chat template
    formatted_prompt = f"""[INST] <<SYS>>
{prompts['system']}
<</SYS>>

{prompts['user']} [/INST]"""
    
    inputs = tokenizer(formatted_prompt, return_tensors="pt").to(model.device)
    
    outputs = model.generate(
        **inputs,
        max_new_tokens=400,
        temperature=temperature,
        top_p=0.9,
        repetition_penalty=1.1,
        do_sample=True
    )
    
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Extract only the assistant's response (after [/INST])
    response = response.split("[/INST]")[-1].strip()
    
    return response
```

### 4.7 Response Post-Processing

```python
def post_process_response(response, retrieved_chunks):
    """
    Format, validate, and enhance response
    """
    # Extract source citations (if not already present)
    if "Source:" not in response and "📚" not in response:
        # Add sources from retrieved chunks
        sources = []
        for chunk in retrieved_chunks[:2]:  # Top 2 sources
            source_str = f"{chunk['book']}, Chapter {chunk.get('chapter', 'N/A')}, Page {chunk['page']}"
            if source_str not in sources:
                sources.append(source_str)
        
        response += f"\n\n\n📚 **Sources:**\n" + "\n".join([f"{i+1}. {s}" for i, s in enumerate(sources)])
    
    # Readability check (Flesch-Kincaid grade level)
    grade_level = calculate_readability(response)
    if grade_level > 8:  # Too complex
        response = simplify_language(response)  # Use simpler words
    
    # Safety check (post-generation)
    if contains_inappropriate_content(response):
        return {
            'safe': False,
            'response': "I encountered an error generating a safe response. Please try rephrasing your question."
        }
    
    # Calculate confidence based on retrieval scores
    avg_relevance = sum(c['relevance_score'] for c in retrieved_chunks) / len(retrieved_chunks)
    
    if avg_relevance > 0.8:
        confidence = "High"
    elif avg_relevance > 0.6:
        confidence = "Medium"
    else:
        confidence = "Low"
        response += "\n\n❓ **Note:** I found limited information on this. "\
                    "Consider asking your teacher for clarification!"
    
    return {
        'safe': True,
        'response': response,
        'confidence': confidence,
        'sources': retrieved_chunks
    }
```

---

## 5. Safety & Guardrails

### 5.1 Multi-Layer Safety Architecture

```
Layer 1: Pre-Retrieval Filtering
  ├─ Intent detection
  ├─ Query classification
  └─ Block prohibited intents

Layer 2: Context Filtering
  ├─ Subject-based chunk filtering
  ├─ Curriculum scope validation
  └─ Age-appropriate content check

Layer 3: Prompt Engineering
  ├─ System prompt with strict rules
  ├─ Few-shot examples (safe responses)
  └─ Output format constraints

Layer 4: Post-Generation Validation
  ├─ Content moderation (Azure/OpenAI)
  ├─ Source citation verification
  ├─ Readability check
  └─ Harmful content detection

Layer 5: Human-in-Loop
  ├─ Parent reviews before sharing with child
  ├─ Feedback mechanism
  └─ Incident reporting
```

### 5.2 Prohibited Response Patterns

```python
PROHIBITED_PATTERNS = [
    # Academic assessment
    r'score|grade|mark|percentage|ranking|comparison',
    
    # Homework solutions
    r'the answer is \d+|the solution is|step 1:.*step 2:',
    
    # Competitive language
    r'better than|worse than|top student|best in class|smartest',
    
    # Inappropriate content
    r'violence|weapon|hate|discrimin|inappropriate',
    
    # Medical/psychological advice
    r'diagnose|disorder|therapy|medication|mental health',
    
    # Personal data requests
    r'your address|phone number|parents work|where do you live',
]

def contains_prohibited_content(text):
    """
    Check if response contains prohibited patterns
    """
    text_lower = text.lower()
    
    for pattern in PROHIBITED_PATTERNS:
        if re.search(pattern, text_lower):
            return True
    
    return False
```

### 5.3 Confidence Thresholds

```python
def determine_response_action(confidence_score, query_text):
    """
    Decide whether to show response, modify, or refuse based on confidence
    """
    if confidence_score > 0.85:
        return {'action': 'show', 'message': None}
    
    elif 0.6 <= confidence_score <= 0.85:
        return {
            'action': 'show_with_warning',
            'message': "⚠️ I found some information, but I'm not completely certain. "\
                       "Please verify with your child's teacher."
        }
    
    else:  # confidence < 0.6
        return {
            'action': 'refuse_politely',
            'message': "❓ I don't have enough information about this in the Std 1 textbooks. "\
                       f"Your question: \"{query_text}\"\n\n"\
                       "💡 Suggestions:\n"\
                       "• Try rephrasing your question\n"\
                       "• Ask your child's teacher\n"\
                       "• Check if this topic is in the Std 1 syllabus"
        }
```

---

## 6. LLM Configuration

### 6.1 Model Selection Rationale

**Chosen: Llama 2 13B Chat (Self-Hosted)**

**Advantages:**
- ✓ Open-source (no API costs, no data sent to third parties)
- ✓ Privacy compliant (on-premise deployment)
- ✓ Sufficient capability for curriculum-grounded Q&A
- ✓ Fine-tuning possible (customize for education domain)
- ✓ Predictable costs (infrastructure only)

**Alternatives Considered:**
| Model | Pros | Cons | Decision |
|-------|------|------|----------|
| GPT-4 | Best performance | Cost ($), privacy concerns, API dependency | ❌ Rejected |
| GPT-3.5 | Good performance, cheaper | Still API-dependent, privacy | ❌ Rejected |
| Llama 2 7B | Faster, lighter | Lower capability, less coherent | ⚠️ Backup option |
| Mistral 7B | Strong performance, efficient | Smaller context window | ⚠️ Alternative |

### 6.2 Inference Configuration

```yaml
model_config:
  model_name: "meta-llama/Llama-2-13b-chat-hf"
  precision: "float16"  # Reduce memory, minimal quality impact
  device: "cuda"  # GPU acceleration
  max_context_length: 4096  # tokens
  
generation_params:
  max_new_tokens: 400  # Response length limit
  temperature: 0.3  # Low = more deterministic, factual
  top_p: 0.9  # Nucleus sampling
  top_k: 50
  repetition_penalty: 1.1  # Reduce repetitive text
  do_sample: true  # Enable sampling for variety
  
performance:
  batch_size: 1  # Real-time responses
  expected_latency: "3-5 seconds"
  gpu_memory: "24GB VRAM (A100 / V100)"
```

### 6.3 Prompt Templates

**System Prompt (Consistent across all queries):**
```
You are KidSpark's Learning Assistant, helping parents explain Standard 1 (first grade) concepts to their children.

CORE MISSION:
Help parents understand curriculum concepts so they can explain them to their 6-7 year old children.

STRICT RULES:
1. ✓ ONLY answer from provided textbook context
2. ✗ NEVER solve homework problems
3. ✗ NEVER assess or grade work
4. ✓ ALWAYS cite source (book, chapter, page)
5. ✓ Use simple, parent-friendly language
6. ✗ DO NOT make comparisons between students
7. ✗ DO NOT predict academic outcomes
8. ✓ Suggest hands-on activities when relevant

RESPONSE STRUCTURE:
1. Direct answer (2-3 sentences)
2. Example from textbook (if available)
3. Source citation
4. [Optional] Practice idea for parent-child

TONE: Encouraging, helpful, educational, never judgmental.
```

**Few-Shot Examples (included in prompt for consistency):**
```
Example 1:
Question: "What is the /sh/ sound?"
Answer: The /sh/ sound is a phonics digraph where two letters (s and h) combine to make one sound, like the "shh" we say when asking someone to be quiet. In the textbook, you'll find examples like "shell," "fish," and "brush" where this sound appears.

Practice idea: Go on a "sh sound hunt" around your home - find objects that start with or contain /sh/!

📚 Source: English Textbook Std 1, Chapter 4 "Sounds We Know", Page 23

---

Example 2:
Question: "How do I teach addition to my child?"
Answer: Addition in Std 1 starts with counting real objects together. The textbook suggests using toys, buttons, or fruits. For example, "2 apples + 3 apples = 5 apples total." Let your child physically group the objects and count them together.

Practice idea: Use snacks during evening time! "You have 3 biscuits, I'll give you 2 more. How many total?"

📚 Source: Mathematics Textbook Std 1, Chapter 3 "Adding Numbers", Pages 18-20
```

---

## 7. Vector Database Design

### 7.1 Weaviate Schema

```json
{
  "class": "TextbookContent",
  "description": "Std 1 English and Math textbook content chunks",
  "vectorizer": "none",
  "properties": [
    {
      "name": "text",
      "dataType": ["text"],
      "description": "Content text of the chunk",
      "indexInverted": true
    },
    {
      "name": "book_title",
      "dataType": ["string"],
      "description": "Textbook name (e.g., 'English Std 1 NCERT')"
    },
    {
      "name": "subject",
      "dataType": ["string"],
      "description": "Subject: English or Math"
    },
    {
      "name": "page_number",
      "dataType": ["int"],
      "description": "Page number in textbook"
    },
    {
      "name": "chapter_number",
      "dataType": ["int"],
      "description": "Chapter number"
    },
    {
      "name": "chapter_title",
      "dataType": ["string"],
      "description": "Chapter name"
    },
    {
      "name": "granularity",
      "dataType": ["string"],
      "description": "Chunk type: page, concept, or example"
    },
    {
      "name": "concept_keywords",
      "dataType": ["string[]"],
      "description": "Key concepts covered (e.g., ['phonics', 'sh sound'])"
    },
    {
      "name": "curriculum_version",
      "dataType": ["string"],
      "description": "Curriculum edition (e.g., '2026_edition')"
    },
    {
      "name": "indexed_date",
      "dataType": ["date"],
      "description": "When this content was indexed"
    }
  ]
}
```

### 7.2 Search Strategies

**Hybrid Search (Vector + Keyword):**
```python
def hybrid_search(query_text, subject=None, alpha=0.7):
    """
    Combine semantic vector search with keyword filtering
    alpha: weight for vector search (0.7) vs keyword (0.3)
    """
    client = weaviate.Client("http://localhost:8080")
    
    # Generate query embedding
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    query_vector = model.encode(query_text).tolist()
    
    query_builder = client.query.get(
        "TextbookContent",
        ["text", "book_title", "subject", "page_number", "chapter_title", "granularity"]
    )
    
    # Hybrid search
    query_builder = query_builder.with_hybrid(
        query=query_text,
        vector=query_vector,
        alpha=alpha  # 1.0 = pure vector, 0.0 = pure keyword
    )
    
    # Filter by subject if specified
    if subject:
        query_builder = query_builder.with_where({
            "path": ["subject"],
            "operator": "Equal",
            "valueString": subject.capitalize()
        })
    
    results = query_builder.with_limit(10).do()
    
    return results['data']['Get']['TextbookContent']
```

---

## 8. Prompt Engineering

### 8.1 Chain-of-Thought for Complex Queries

```python
def handle_complex_query(query_text, retrieved_chunks):
    """
    For multi-step explanations, use chain-of-thought prompting
    """
    system_prompt = """
You are explaining Std 1 concepts to parents. For complex topics, break down your explanation step-by-step.

STRUCTURE:
1. Identify what concept the parent is asking about
2. Explain the concept simply
3. Give an example from the textbook
4. Suggest how parent can demonstrate to child
5. Cite source
"""
    
    user_prompt = f"""
Question: {query_text}

Context from textbook:
{format_chunks(retrieved_chunks)}

Please explain step-by-step how a parent should teach this to their 6-year-old child.
"""
    
    return {'system': system_prompt, 'user': user_prompt}
```

### 8.2 Handling "I Don't Know"

```python
def construct_idk_response(query_text, low_confidence_chunks):
    """
    Graceful handling when no good answer found
    """
    response = f"❓ **Limited Information Found**\n\n"
    
    if low_confidence_chunks:
        response += "I found some related content, but I'm not confident it fully answers your question:\n\n"
        response += f"Your question: \"{query_text}\"\n\n"
        response += f"Related topic from textbook: {low_confidence_chunks[0]['chapter_title']}, "\
                    f"Page {low_confidence_chunks[0]['page_number']}\n\n"
    else:
        response += f"I don't have information about \"{query_text}\" in the Std 1 textbooks.\n\n"
    
    response += "💡 **Next Steps:**\n"
    response += "• Try rephrasing your question with different words\n"
    response += "• Check if this topic is covered in the Std 1 syllabus\n"
    response += "• Ask your child's teacher directly - they're the best resource!\n"
    
    return response
```

---

## 9. Performance Optimization

### 9.1 Caching Strategy

```python
from functools import lru_cache
import redis

# In-memory cache for LLM responses
redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_cached_response(query_text):
    """
    Check if query has been answered recently
    """
    cache_key = f"rag_response:{hashlib.md5(query_text.encode()).hexdigest()}"
    cached = redis_client.get(cache_key)
    
    if cached:
        return json.loads(cached)
    
    return None

def cache_response(query_text, response, ttl=86400):  # 24 hours
    """
    Store response in cache
    """
    cache_key = f"rag_response:{hashlib.md5(query_text.encode()).hexdigest()}"
    redis_client.setex(cache_key, ttl, json.dumps(response))

# Embedding cache (for repeated queries)
@lru_cache(maxsize=1000)
def get_cached_embedding(text):
    """
    Cache query embeddings in memory
    """
    model = SentenceTransformer('all-MiniLM-L6-v2')
    return model.encode(text).tolist()
```

### 9.2 Batch Processing for Offline Tasks

```
Daily Tasks (Triggered at 2 AM):
1. Re-index any updated textbook content
2. Regenerate embeddings if model updated
3. Clear stale cache entries
4. Compress audit logs older than 90 days
```

### 9.3 Load Balancing

```
┌──────────────┐
│  API Gateway │
│ (Rate Limit) │
└──────┬───────┘
       │
       ├────────────────┬────────────────┐
       ▼                ▼                ▼
┌────────────┐   ┌────────────┐   ┌────────────┐
│ RAG Worker │   │ RAG Worker │   │ RAG Worker │
│   Pod 1    │   │   Pod 2    │   │   Pod 3    │
└────────────┘   └────────────┘   └────────────┘
       │                │                │
       └────────────────┴────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │  Vector DB       │
              │  (Read Replicas) │
              └──────────────────┘
```

### 9.4 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **End-to-End Latency** | < 5 seconds (p95) | From query submission to response display |
| **Concurrent Queries** | 50 queries/second | Peak capacity per instance |
| **Cache Hit Rate** | > 40% | Percentage of queries served from cache |
| **Error Rate** | < 1% | Failed queries / total queries |
| **Relevance Score** | > 0.85 (avg) | Retrieved chunks relevance to query |

---

## 10. Monitoring & Logging

### 10.1 Query Logging Schema

```json
{
  "log_id": "uuid",
  "timestamp": "2026-02-18T19:45:23Z",
  "user_id": "parent_uuid",
  "child_id": "child_uuid",
  "query_text": "What is the /sh/ sound?",
  "query_text_corrected": "What is the /sh/ sound?",
  "subject_classification": "english",
  "intent_classification": "concept_explanation",
  "safety_pre_check": "passed",
  "safety_pre_check_issues": null,
  
  "retrieval": {
    "chunks_retrieved": 5,
    "top_chunk_relevance": 0.92,
    "avg_relevance": 0.87,
    "sources": [
      {"book": "English Std 1", "page": 23, "chapter": 4},
      {"book": "English Std 1", "page": 24, "chapter": 4}
    ]
  },
  
  "generation": {
    "model": "llama-2-13b-chat",
    "temperature": 0.3,
    "tokens_prompt": 856,
    "tokens_response": 187,
    "latency_ms": 4200
  },
  
  "response": {
    "text": "[Full response text]",
    "confidence": "high",
    "safety_post_check": "passed",
    "word_count": 89,
    "readability_grade": 5.2
  },
  
  "user_feedback": {
    "rating": "helpful",  # helpful / not_helpful / null
    "feedback_text": null,
    "timestamp": "2026-02-18T19:46:10Z"
  },
  
  "performance": {
    "total_latency_ms": 4650,
    "cached": false
  }
}
```

### 10.2 Monitoring Dashboards

**Real-Time Metrics (Grafana):**
```
Dashboard 1: Query Health
- Queries per minute
- Average latency (p50, p95, p99)
- Error rate
- Cache hit rate

Dashboard 2: RAG Performance
- Average relevance score
- Retrieval accuracy
- Confidence distribution (high/medium/low)
- "I don't know" response rate

Dashboard 3: Safety & Compliance
- Blocked queries (by reason)
- Safety filter triggers
- Inappropriate content detections
- Manual review queue size

Dashboard 4: User Engagement
- Unique users querying per day
- Queries per user (distribution)
- Feedback rating distribution
- Most common query topics
```

### 10.3 Alerting Rules

```yaml
alerts:
  - name: "High Error Rate"
    condition: error_rate > 5% for 5 minutes
    severity: critical
    notify: engineering_team
    
  - name: "High Latency"
    condition: p95_latency > 8 seconds for 10 minutes
    severity: warning
    notify: on_call_engineer
    
  - name: "Safety Filter Spike"
    condition: blocked_queries > 20 per hour
    severity: warning
    notify: safety_team
    
  - name: "Low Relevance Scores"
    condition: avg_relevance < 0.6 for 1 hour
    severity: warning
    notify: ml_team
    action: investigate_content_quality
```

### 10.4 Quarterly Review Process

```
Every 3 Months:
1. Review all "not helpful" feedback
2. Analyze failed queries (no good answer)
3. Update knowledge base if curriculum changes
4. Retrain subject classifier if drift detected
5. Audit sample responses for quality
6. Update prohibited patterns if new abuse vectors found
7. Benchmark against alternative models
8. Optimize embedding model (if better alternatives emerged)
```

---

## Appendix A: Sample API Contract

**Request:**
```json
POST /api/v1/ai-helper/query

{
  "query": "What is the /sh/ sound in phonics?",
  "parent_id": "uuid",
  "child_id": "uuid",
  "session_id": "uuid"
}
```

**Response (Success):**
```json
{
  "success": true,
  "query_id": "uuid",
  "response": {
    "text": "The /sh/ sound is a phonics digraph where two letters (s and h) combine to make one sound, like the \"shh\" we say when asking someone to be quiet. In the textbook, you'll find examples like \"shell,\" \"fish,\" and \"brush\" where this sound appears.\n\nPractice idea: Go on a \"sh sound hunt\" around your home - find objects that start with or contain /sh/!\n\n📚 Source: English Textbook Std 1, Chapter 4 \"Sounds We Know\", Page 23",
    "confidence": "high",
    "sources": [
      {
        "book": "English Std 1",
        "chapter": 4,
        "chapter_title": "Sounds We Know",
        "page": 23
      }
    ]
  },
  "metadata": {
    "subject": "english",
    "latency_ms": 4200,
    "cached": false
  }
}
```

**Response (Blocked Query):**
```json
{
  "success": false,
  "error_code": "QUERY_BLOCKED",
  "message": "I can explain concepts, but I can't solve homework for you. Let me explain how to approach this type of question instead.",
  "reason": "homework_solution_request",
  "suggestion": "Try asking: 'How do I explain addition to my child?'"
}
```

---

## Appendix B: Security Considerations

### Data Encryption
- All query logs encrypted at rest (AES-256)
- TLS 1.3 for all API communications
- Vector DB access restricted to backend services only

### Access Control
- API keys rotated every 90 days
- Role-based access (parent vs teacher vs admin)
- Rate limiting: 20 queries/hour per parent

### Audit Trail
- All queries logged immutably
- Parent can export their query history
- Teachers cannot see parent queries

---

**Document Status:** RAG Architecture v1.0  
**Last Updated:** February 18, 2026  
**Technical Owner:** ML/AI Team Lead
