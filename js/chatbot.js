/**
 * KidSpark AI Chatbot
 * RAG-based Q&A with typing animation effect
 * Chapter-wise YouTube video panel (opens on right side when chapter header is clicked)
 *
 * 📺 VIDEO LINKS → edit js/video-links.js to change chapter videos
 */

const KSChatbot = {
    currentSubject: 'english',
    speechSynth: window.speechSynthesis || null,

    init() {
        this.bindTabs();
        this.renderBooks('english');
        this.bindAnswerPanel();
        this.bindVideoPanel();
    },

    bindTabs() {
        document.querySelectorAll('.subject-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.subject-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentSubject = tab.dataset.subject;
                this.renderBooks(this.currentSubject);
                this.closeAnswer();
                this.closeVideoPanel();
            });
        });
    },

    renderBooks(subject) {
        const container = document.getElementById('chatbot-books');
        if (!container) return;
        container.innerHTML = '';

        const chunks = RAG_DATA[subject] || [];
        const units = {};
        chunks.forEach(c => {
            if (!units[c.unit]) units[c.unit] = { title: c.title, chunks: [] };
            units[c.unit].chunks.push(c);
        });

        Object.entries(units).forEach(([unit, { title, chunks }], idx) => {
            const book = document.createElement('div');
            book.className = 'chatbot-book';

            // Look up video for this unit
            const videoInfo = CHAPTER_VIDEOS[unit] || CHAPTER_VIDEOS['default'];

            book.innerHTML = `
                <div class="chatbot-book-header" id="book-header-${idx}" data-unit="${unit}" data-video-id="${videoInfo.videoId}" data-video-title="${videoInfo.title}" data-video-label="${videoInfo.label}">
                    <span class="chatbot-book-title">📖 ${unit}: ${title}</span>
                    <div class="chatbot-book-actions">
                        <button class="video-btn" title="Watch chapter video" onclick="KSChatbot.openVideoFromBtn(this)">▶ Video</button>
                        <span class="chatbot-book-toggle">▼</span>
                    </div>
                </div>
                <div class="chatbot-qs" id="book-qs-${idx}">
                    ${chunks.map((c, qi) => `
                        <div class="chatbot-q" data-chunk-id="${c.id}" id="cq-${c.id}">
                            <span class="chatbot-q-num">${qi + 1}.</span>
                            <span>${c.question}</span>
                        </div>
                    `).join('')}
                </div>
            `;

            // Toggle accordion on header (not video button)
            const header = book.querySelector('.chatbot-book-header');
            header.addEventListener('click', (e) => {
                if (e.target.closest('.video-btn')) return; // Don't toggle on video btn
                book.classList.toggle('open');
                // Also open video panel on header click
                this.openVideo(videoInfo.videoId, videoInfo.title, videoInfo.label);
            });

            // Question click → show answer
            book.querySelectorAll('.chatbot-q').forEach(qEl => {
                qEl.addEventListener('click', () => {
                    const id = qEl.dataset.chunkId;
                    const chunk = [...RAG_DATA.english, ...RAG_DATA.maths].find(c => c.id === id);
                    if (chunk) this.showAnswer(chunk);
                });
            });

            if (idx === 0) book.classList.add('open');
            container.appendChild(book);
        });
    },

    // Called from inline onclick on video button
    openVideoFromBtn(btn) {
        const header = btn.closest('.chatbot-book-header');
        if (!header) return;
        const videoId = header.dataset.videoId;
        const title = header.dataset.videoTitle;
        const label = header.dataset.videoLabel;
        this.openVideo(videoId, title, label);
    },

    openVideo(videoId, title, label) {
        const panel = document.getElementById('video-panel');
        const titleEl = document.getElementById('video-panel-title');
        const iframe = document.getElementById('video-iframe');
        const labelEl = document.getElementById('video-panel-label');
        if (!panel || !iframe) return;

        // Extract bare ID in case a full URL was passed
        const id = (typeof extractYouTubeId === 'function')
            ? extractYouTubeId(videoId)
            : videoId;

        if (!id) {
            console.warn('KSChatbot: no valid YouTube ID for', videoId);
            return;
        }

        // Update panel content
        if (titleEl) titleEl.textContent = title;
        if (labelEl) labelEl.textContent = label;

        // Set YouTube embed URL (privacy-enhanced mode)
        iframe.src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&autoplay=1`;

        panel.classList.remove('hidden');
        panel.classList.add('open');
    },

    closeVideoPanel() {
        const panel = document.getElementById('video-panel');
        const iframe = document.getElementById('video-iframe');
        if (panel) { panel.classList.add('hidden'); panel.classList.remove('open'); }
        if (iframe) iframe.src = ''; // Stop video playback
    },

    bindVideoPanel() {
        const closeBtn = document.getElementById('close-video-panel');
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeVideoPanel());
    },

    showAnswer(chunk) {
        const panel = document.getElementById('chatbot-answer-panel');
        const qEl = document.getElementById('answer-question');
        const aEl = document.getElementById('answer-text');
        if (!panel || !qEl || !aEl) return;

        qEl.textContent = chunk.question;
        aEl.innerHTML = '';
        panel.classList.remove('hidden');
        panel.scrollIntoView({ behavior: 'smooth', block: 'end' });
        this.typeAnswer(chunk.answer, aEl);
    },

    typeAnswer(text, container) {
        container.innerHTML = '';
        const formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        const plainText = text.replace(/\*\*(.*?)\*\*/g, '$1');
        let i = 0;
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        container.appendChild(cursor);
        const speed = Math.max(15, Math.min(45, 1500 / plainText.length));
        const type = () => {
            if (i < plainText.length) {
                cursor.remove();
                const slice = plainText.substring(0, i + 1);
                const htmlSlice = slice
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br>');
                container.innerHTML = htmlSlice;
                container.appendChild(cursor);
                i++;
                setTimeout(type, speed);
            } else {
                cursor.remove();
                container.innerHTML = formatted;
            }
        };
        setTimeout(type, 100);
    },

    closeAnswer() {
        const panel = document.getElementById('chatbot-answer-panel');
        if (panel) panel.classList.add('hidden');
    },

    bindAnswerPanel() {
        const closeBtn = document.getElementById('close-answer');
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeAnswer());

        const readAloud = document.getElementById('answer-read-aloud');
        if (readAloud) {
            readAloud.addEventListener('click', () => {
                const aEl = document.getElementById('answer-text');
                if (!aEl || !this.speechSynth) return;
                const text = aEl.textContent.replace(/[⭐🎉📖🔢🌟💡✅❌🍎🍌]/g, '');
                this.speechSynth.cancel();
                const utt = new SpeechSynthesisUtterance(text);
                utt.rate = 0.85;
                utt.pitch = 1.1;
                this.speechSynth.speak(utt);
                KSApp.showToast('🔊 Reading aloud!', 'success');
            });
        }
    }
};
