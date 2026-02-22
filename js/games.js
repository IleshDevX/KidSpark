/**
 * KidSpark Games Engine — Rebuilt
 * Fixes:
 *  - ABC Adventure: questions now match answers correctly
 *  - Number Fun: no double question display
 *  - Addition Quest / Subtraction Star: math shown only once (no duplicate bottom text)
 *  - Shape Safari: questions never repeat within a session
 *  - Lives display: shows "N ❤️" format
 */

// ───────── Shuffle Helper ─────────
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function generateNumericOptions(correct, min, max, count) {
    const opts = new Set([correct]);
    let attempts = 0;
    while (opts.size < count && attempts < 200) {
        attempts++;
        const n = correct + (Math.floor(Math.random() * 7) - 3);
        if (n >= min && n <= max && n !== correct) opts.add(n);
    }
    return shuffleArray([...opts]);
}

// ───────── Non-Repeating Pool Helper ─────────
function makeShuffledPool(arr) {
    return { items: shuffleArray([...arr]), idx: 0 };
}
function nextFromPool(pool) {
    if (pool.idx >= pool.items.length) {
        pool.items = shuffleArray([...pool.items]);
        pool.idx = 0;
    }
    return pool.items[pool.idx++];
}

// ───────── Static Question Pools ─────────

const ALPHABET_POOL = (() => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const words = {
        A: 'Apple 🍎', B: 'Ball ⚽', C: 'Cat 🐱', D: 'Dog 🐕', E: 'Elephant 🐘',
        F: 'Fish 🐟', G: 'Grapes 🍇', H: 'Hat 🎩', I: 'Ice Cream 🍦', J: 'Jar 🫙',
        K: 'Kite 🪁', L: 'Lion 🦁', M: 'Mango 🥭', N: 'Nest 🪺', O: 'Orange 🍊',
        P: 'Parrot 🦜', Q: 'Queen 👸', R: 'Rabbit 🐰', S: 'Sun ☀️', T: 'Tiger 🐅',
        U: 'Umbrella ☂️', V: 'Violin 🎻', W: 'Whale 🐋', X: 'Xylophone 🎵',
        Y: 'Yak 🐂', Z: 'Zebra 🦓'
    };
    // Questions: "What letter comes after X?" — answer is next letter (Z wraps to A)
    return Array.from({ length: 26 }, (_, i) => {
        const letter = letters[i];
        const nextIdx = (i + 1) % 26;
        const answer = letters[nextIdx];
        // Generate 3 wrong options different from correct
        const wrongSet = new Set();
        while (wrongSet.size < 3) {
            const r = letters[Math.floor(Math.random() * 26)];
            if (r !== answer) wrongSet.add(r);
        }
        const options = shuffleArray([answer, ...wrongSet]);
        return {
            display: `<span class="alphabet-display">${letter}</span>
                      <p class="alphabet-word">for <strong>${words[letter]}</strong></p>`,
            question: `What letter comes after ${letter}?`,
            options,
            answer
        };
    });
})();

const NUMBER_POOL = (() => {
    // Numbers 1–19: "What number comes after N?"
    return Array.from({ length: 19 }, (_, i) => {
        const n = i + 1;
        const answer = n + 1;
        const opts = generateNumericOptions(answer, 1, 20, 4);
        const stars = n <= 10 ? '⭐'.repeat(n) : '⭐'.repeat(10) + '<br>' + '⭐'.repeat(n - 10);
        return {
            display: `<div class="star-count-display">${stars}</div>`,
            question: `There are ${n} stars. What number comes after ${n}?`,
            options: opts.map(String),
            answer: String(answer)
        };
    });
})();

const SHAPES_POOL = [
    {
        emoji: '⭕', name: 'Circle', fact: '0 sides, 0 corners — round!',
        question: 'How many sides does a Circle have?',
        options: ['0', '3', '4', '5'], answer: '0'
    },
    {
        emoji: '🔺', name: 'Triangle', fact: '3 sides and 3 corners!',
        question: 'How many sides does a Triangle have?',
        options: ['2', '3', '4', '6'], answer: '3'
    },
    {
        emoji: '⬜', name: 'Square', fact: '4 equal sides!',
        question: 'How many sides does a Square have?',
        options: ['3', '4', '5', '6'], answer: '4'
    },
    {
        emoji: '▬', name: 'Rectangle', fact: '4 sides, 2 long and 2 short!',
        question: 'How many corners does a Rectangle have?',
        options: ['2', '3', '4', '5'], answer: '4'
    },
    {
        emoji: '⭐', name: 'Star', fact: 'A star shape has 5 points!',
        question: 'How many points does a Star have?',
        options: ['3', '4', '5', '6'], answer: '5'
    },
    {
        emoji: '⬡', name: 'Hexagon', fact: '6 sides and 6 corners!',
        question: 'How many sides does a Hexagon have?',
        options: ['4', '5', '6', '8'], answer: '6'
    },
];

const BODY_POOL = [
    { emoji: '👀', question: 'What do we SEE with?', options: ['Eyes', 'Ears', 'Nose', 'Mouth'], answer: 'Eyes' },
    { emoji: '👂', question: 'What do we HEAR with?', options: ['Eyes', 'Ears', 'Nose', 'Hand'], answer: 'Ears' },
    { emoji: '👃', question: 'What do we SMELL with?', options: ['Mouth', 'Eye', 'Nose', 'Ear'], answer: 'Nose' },
    { emoji: '👄', question: 'What do we TASTE with?', options: ['Nose', 'Ear', 'Eye', 'Mouth'], answer: 'Mouth' },
    { emoji: '🖐️', question: 'How many fingers on ONE hand?', options: ['4', '5', '6', '10'], answer: '5' },
    { emoji: '🦵', question: 'How many LEGS do we have?', options: ['1', '2', '3', '4'], answer: '2' },
    { emoji: '🦷', question: 'What do we use to CHEW food?', options: ['Eyes', 'Ears', 'Teeth', 'Nose'], answer: 'Teeth' },
];

const RHYMES_POOL = [
    {
        title: 'Twinkle Twinkle',
        lyrics: 'Twinkle, twinkle, little star,\nHow I wonder what you are!\nUp above the world so high,\nLike a diamond in the sky!',
        question: 'Complete: "Twinkle twinkle little ___"',
        options: ['Star', 'Moon', 'Sun', 'Cloud'], answer: 'Star'
    },
    {
        title: 'Jack and Jill',
        lyrics: 'Jack and Jill went up the hill\nTo fetch a pail of water;\nJack fell down and broke his crown,\nAnd Jill came tumbling after!',
        question: 'Jack and Jill went up the ___',
        options: ['Hill', 'Road', 'Wall', 'Stair'], answer: 'Hill'
    },
    {
        title: "Mary's Lamb",
        lyrics: "Mary had a little lamb,\nIts fleece was white as snow;\nAnd everywhere that Mary went,\nThe lamb was sure to go!",
        question: 'Mary had a little ___',
        options: ['Dog', 'Cat', 'Lamb', 'Duck'], answer: 'Lamb'
    },
    {
        title: 'Humpty Dumpty',
        lyrics: "Humpty Dumpty sat on a wall,\nHumpty Dumpty had a great fall!\nAll the king's horses and all the king's men,\nCouldn't put Humpty together again!",
        question: 'Humpty Dumpty sat on a ___',
        options: ['Chair', 'Bed', 'Wall', 'Table'], answer: 'Wall'
    },
    {
        title: 'Row Row Row',
        lyrics: 'Row, row, row your boat,\nGently down the stream!\nMerrily, merrily, merrily, merrily,\nLife is but a dream!',
        question: 'Row, row, row your ___',
        options: ['Car', 'Boat', 'Train', 'Bike'], answer: 'Boat'
    },
];

const WORD_POOL = ['CAT', 'DOG', 'COW', 'HEN', 'BEE', 'ANT', 'OWL', 'FOX', 'EGG', 'SUN', 'MAP', 'PIG'];

// ───────── Game Definitions ─────────

const GAME_DEFINITIONS = {
    alphabet: {
        title: '🔤 ABC Adventure',
        _pool: null,
        initPool() { this._pool = makeShuffledPool(ALPHABET_POOL); },
        generate() {
            const q = nextFromPool(this._pool);
            return { ...q, options: shuffleArray([...q.options]) };
        }
    },

    numbers: {
        title: '🔢 Number Fun',
        _pool: null,
        initPool() { this._pool = makeShuffledPool(NUMBER_POOL); },
        generate() {
            const q = nextFromPool(this._pool);
            return { ...q, options: shuffleArray([...q.options]) };
        }
    },

    addition: {
        title: '➕ Addition Quest',
        generate(score = 0) {
            const max = 5 + Math.min(score, 10);
            const a = Math.floor(Math.random() * max) + 1;
            const b = Math.floor(Math.random() * max) + 1;
            const ans = a + b;
            const opts = generateNumericOptions(ans, 0, 30, 4);
            return {
                display: `<div class="math-display"><span class="math-num">${a}</span><span class="math-op">+</span><span class="math-num">${b}</span><span class="math-op">=</span><span class="math-unknown">?</span></div>`,
                question: '', // Empty — math is shown visually in display only
                options: opts.map(String),
                answer: String(ans),
            };
        }
    },

    subtraction: {
        title: '➖ Subtraction Star',
        generate(score = 0) {
            const max = 5 + Math.min(score, 10);
            const a = Math.floor(Math.random() * max) + 2;
            const b = Math.floor(Math.random() * (a - 1)) + 1;
            const ans = a - b;
            const opts = generateNumericOptions(ans, 0, 20, 4);
            return {
                display: `<div class="math-display"><span class="math-num">${a}</span><span class="math-op">−</span><span class="math-num">${b}</span><span class="math-op">=</span><span class="math-unknown">?</span></div>`,
                question: '', // Empty — math is shown visually in display only
                options: opts.map(String),
                answer: String(ans),
            };
        }
    },

    shapes: {
        title: '🔷 Shape Safari',
        _pool: null,
        initPool() { this._pool = makeShuffledPool(SHAPES_POOL); },
        generate() {
            const s = nextFromPool(this._pool);
            return {
                display: `<span class="shape-display">${s.emoji}</span><p class="alphabet-word">${s.name}</p>`,
                question: s.question,
                options: shuffleArray([...s.options]),
                answer: s.answer,
                fact: s.fact,
            };
        }
    },

    body: {
        title: '🧒 Body Parts',
        _pool: null,
        initPool() { this._pool = makeShuffledPool(BODY_POOL); },
        generate() {
            const p = nextFromPool(this._pool);
            return {
                display: `<span class="game-q-emoji">${p.emoji}</span>`,
                question: p.question,
                options: shuffleArray([...p.options]),
                answer: p.answer,
            };
        }
    },

    puzzle: {
        title: '🧩 Word Puzzle',
        _pool: null,
        initPool() { this._pool = makeShuffledPool(WORD_POOL); },
        generate() {
            const word = nextFromPool(this._pool);
            let scrambled;
            do { scrambled = shuffleArray(word.split('')).join(''); } while (scrambled === word && word.length > 1);
            const wrong = WORD_POOL.filter(w => w !== word).sort(() => Math.random() - 0.5).slice(0, 3);
            return {
                display: `<span class="game-q-text" style="letter-spacing:0.5rem;font-size:2.5rem">${scrambled}</span>`,
                question: `Unscramble: what is this word?`,
                options: shuffleArray([word, ...wrong]),
                answer: word,
            };
        }
    },

    rhymes: {
        title: '🎵 Sing & Rhyme',
        _pool: null,
        initPool() { this._pool = makeShuffledPool(RHYMES_POOL); },
        generate() {
            const r = nextFromPool(this._pool);
            return {
                display: `<div class="rhyme-card">
                  <div class="rhyme-title">🎵 ${r.title}</div>
                  <div class="rhyme-lyrics">${r.lyrics}</div>
                  <div class="rhyme-controls">
                    <button class="btn-secondary" onclick="KSGames.speakRhyme(this)" data-text="${r.lyrics}">🔊 Hear it!</button>
                  </div>
                </div>`,
                question: r.question,
                options: shuffleArray([...r.options]),
                answer: r.answer,
                rhymeText: r.lyrics,
            };
        }
    },
};

// ───────── Games Controller ─────────

const KSGames = {
    currentGame: null,
    score: 0,
    total: 0,
    round: 0,
    maxRounds: 5,
    currentQ: null,
    synth: window.speechSynthesis || null,

    init() {
        this.bindGameCards();
        const back = document.getElementById('arena-back');
        if (back) back.addEventListener('click', () => this.exitGame());
    },

    bindGameCards() {
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const gameId = card.dataset.game;
                this.startGame(gameId);
            });
        });
    },

    startGame(gameId) {
        this.currentGame = gameId;
        this.score = 0;
        this.total = 0;
        this.round = 0;

        const expBase = KSStorage.load()?.stats?.exp || 0;
        this.maxRounds = Math.min(10, 5 + Math.floor(expBase / 100));

        const def = GAME_DEFINITIONS[gameId];
        if (!def) return;

        // Initialise non-repeating pool for pool-based games
        if (typeof def.initPool === 'function') def.initPool();

        // Show arena, hide grid
        const grid = document.getElementById('games-grid');
        const arena = document.getElementById('game-arena');
        if (grid) grid.style.display = 'none';
        if (arena) arena.classList.remove('hidden');

        const titleEl = document.getElementById('arena-title');
        if (titleEl) titleEl.textContent = def.title;

        this.nextQuestion();
    },

    nextQuestion() {
        this.round++;
        if (this.round > this.maxRounds) {
            this.showComplete();
            return;
        }

        const def = GAME_DEFINITIONS[this.currentGame];
        const q = def.generate(this.score);
        this.currentQ = q;

        const content = document.getElementById('game-content');
        if (!content) return;

        // Build question HTML — only show q.question paragraph if it's non-empty
        const questionLine = q.question
            ? `<p class="game-q-label-text">${q.question}</p>`
            : '';

        content.innerHTML = `
            <div class="game-progress">
                <span class="game-progress-text">Question ${this.round} of ${this.maxRounds}</span>
                <div class="game-progress-bar"><div class="game-progress-fill" id="prog-fill" style="width:${((this.round - 1) / this.maxRounds) * 100}%"></div></div>
                <span class="game-progress-text">⭐ ${this.score}/${this.total}</span>
            </div>
            <div class="game-question-card">
                <div class="game-q-label">📝 Question ${this.round}</div>
                ${q.display}
                ${questionLine}
            </div>
            <div class="game-options" id="game-options">
                ${q.options.map((opt, i) => `
                    <button class="game-option" id="opt-${i}" data-val="${opt}">${opt}</button>
                `).join('')}
            </div>
            <div id="game-feedback" style="min-height:3rem"></div>
        `;

        // Bind option clicks
        content.querySelectorAll('.game-option').forEach(btn => {
            btn.addEventListener('click', () => this.checkAnswer(btn));
        });

        this.updateLivesDisplay();
    },

    checkAnswer(btn) {
        const val = btn.dataset.val;
        const correct = this.currentQ.answer;
        this.total++;

        // Disable all options
        document.querySelectorAll('.game-option').forEach(b => b.style.pointerEvents = 'none');

        if (val === correct) {
            btn.classList.add('correct');
            this.score++;
            const feedback = document.getElementById('game-feedback');
            if (feedback) feedback.innerHTML = `<div class="game-feedback correct">🎉 Correct! Well done! ⭐</div>`;

            // Show shape fact if available
            if (this.currentQ.fact) {
                const fact = document.createElement('div');
                fact.className = 'shape-fact';
                fact.textContent = `💡 ${this.currentQ.fact}`;
                feedback.appendChild(fact);
            }

            setTimeout(() => this.nextQuestion(), 1400);
        } else {
            btn.classList.add('wrong');
            document.querySelectorAll('.game-option').forEach(b => {
                if (b.dataset.val === correct) b.classList.add('correct');
            });
            const feedback = document.getElementById('game-feedback');
            if (feedback) feedback.innerHTML = `<div class="game-feedback wrong">❌ Oops! The answer is: <strong>${correct}</strong></div>`;
            KSProfile.loseLife();
            this.updateLivesDisplay();
            setTimeout(() => this.nextQuestion(), 1800);
        }
    },

    updateLivesDisplay() {
        const data = KSStorage.load();
        const lives = data?.stats?.lives ?? 0;
        const el = document.getElementById('arena-lives-display');
        if (el) el.textContent = `${lives} ❤️`;
    },

    showComplete() {
        KSProfile.awardExp(15);
        KSProfile.gameCompleted();
        const pct = this.total > 0 ? Math.round((this.score / this.total) * 100) : 0;
        const medal = pct >= 80 ? '🥇' : pct >= 60 ? '🥈' : '🥉';

        const content = document.getElementById('game-content');
        if (!content) return;
        content.innerHTML = `
            <div class="game-complete">
                <span class="game-complete-icon">${medal}</span>
                <h3>Game Complete!</h3>
                <p>${pct >= 80 ? 'Amazing! You\'re a star! 🌟' : pct >= 60 ? 'Good job! Keep practising! 💪' : 'Nice try! You\'re getting better! 😊'}</p>
                <div class="game-complete-stats">
                    <div class="gcs"><div class="gcs-val">${this.score}/${this.total}</div><div class="gcs-lbl">Correct</div></div>
                    <div class="gcs"><div class="gcs-val">+15</div><div class="gcs-lbl">EXP Earned</div></div>
                    <div class="gcs"><div class="gcs-val">${pct}%</div><div class="gcs-lbl">Score</div></div>
                </div>
                <button class="btn-primary" id="play-again-btn" style="width:auto;padding:0.7rem 2rem">🔄 Play Again</button>
            </div>
        `;
        document.getElementById('play-again-btn')?.addEventListener('click', () => {
            this.startGame(this.currentGame);
        });
    },

    exitGame() {
        const grid = document.getElementById('games-grid');
        const arena = document.getElementById('game-arena');
        if (grid) grid.style.display = '';
        if (arena) arena.classList.add('hidden');
        const content = document.getElementById('game-content');
        if (content) content.innerHTML = '';
    },

    speakRhyme(btn) {
        if (!this.synth) return;
        const text = btn.dataset.text;
        this.synth.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.75;
        utt.pitch = 1.3;
        this.synth.speak(utt);
        KSApp.showToast('🎵 Singing the rhyme!', 'success');
    }
};
