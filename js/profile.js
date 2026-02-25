/**
 * KidSpark Profile Manager
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles:
 *  • EXP, levels, stars, lives, level-up toasts
 *  • Candy Crush–style level progress path (renderLevelPath)
 *  • Avatar system: emoji picker + image-file upload, global update
 *  • Sidebar lives display + home avatar mini-ring
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* ── Level definitions ──────────────────────────────────────────────────── */
const LEVELS = [
    { level: 1, name: 'Little Spark', expNeeded: 0, emoji: '🌟' },
    { level: 2, name: 'Curious Mind', expNeeded: 100, emoji: '🧠' },
    { level: 3, name: 'Star Reader', expNeeded: 250, emoji: '📚' },
    { level: 4, name: 'Math Wizard', expNeeded: 500, emoji: '🧙' },
    { level: 5, name: 'Super Spark', expNeeded: 800, emoji: '⚡' },
    { level: 6, name: 'Brain Hero', expNeeded: 1200, emoji: '🦸' },
    { level: 7, name: 'Knowledge King', expNeeded: 1800, emoji: '👑' },
];

/* ── Predefined emoji avatar options ────────────────────────────────────── */
const AVATARS = [
    '🌟', '🚀', '🎨', '🧩', '🦕', '🦉',
    '🐱', '🐶', '🦄', '🐯', '🤖', '👾',
    '🦊', '🐸', '🐧', '🦁', '🐲', '🌈',
    '⚡', '🎯', '🏆', '💎', '🔮', '🎪',
];

/* ══════════════════════════════════════════════════════════════════════════
   KSProfile — main profile controller
   ══════════════════════════════════════════════════════════════════════════ */
const KSProfile = {

    /* Holds the avatar value (emoji string or base64 data URL) being previewed */
    pendingAvatar: null,

    /* ── Level helpers ──────────────────────────────────────────────────── */

    /** Return the current LEVELS entry for a given EXP value */
    getLevel(exp) {
        let current = LEVELS[0];
        for (const lvl of LEVELS) {
            if (exp >= lvl.expNeeded) current = lvl;
        }
        return current;
    },

    /** Return the next LEVELS entry (or null if already max level) */
    getNextLevel(exp) {
        const idx = LEVELS.findIndex(l => l.expNeeded > exp);
        return idx === -1 ? null : LEVELS[idx];
    },

    /* ── EXP / stars / lives ────────────────────────────────────────────── */

    /**
     * Award EXP (default +15) and +1 star.
     * Triggers level-up toast and re-renders all profile UI.
     */
    awardExp(amount = 15) {
        const data = KSStorage.load();
        if (!data) return;

        const prevLevel = this.getLevel(data.stats.exp);

        /* Increment stats */
        data.stats.exp = (data.stats.exp || 0) + amount;
        data.stats.stars = (data.stats.stars || 0) + 1;
        KSStorage.save(data);

        const newLevel = this.getLevel(data.stats.exp);

        /* Level-up notification */
        if (newLevel.level > prevLevel.level) {
            KSApp.showToast(`🎉 LEVEL UP! You are now ${newLevel.name} ${newLevel.emoji}!`, 'success');
            /* Unlock next level on the Candy Crush path */
            this.unlockNextLevel(newLevel.level);
        } else {
            KSApp.showToast(`+${amount} EXP earned! ⭐`, 'success');
        }

        this.renderAll();
    },

    /**
     * Deduct one life. Returns false if already at 0.
     */
    loseLife() {
        const data = KSStorage.load();
        if (!data) return false;
        if (data.stats.lives <= 0) {
            KSApp.showToast('💔 No lives left! Wait for recharge!', 'error');
            return false;
        }
        data.stats.lives = Math.max(0, (data.stats.lives || 20) - 1);
        KSStorage.save(data);
        this.renderLives();
        this.renderSidebarLives();
        return true;
    },

    /** Increment games-played counter */
    gameCompleted() {
        const data = KSStorage.load();
        if (!data) return;
        data.stats.gamesPlayed = (data.stats.gamesPlayed || 0) + 1;
        KSStorage.save(data);
    },

    /* ── Main render ────────────────────────────────────────────────────── */

    /** Full profile section render */
    render() {
        const data = KSStorage.load();
        if (!data) return;

        const stats = data.stats;
        const level = this.getLevel(stats.exp || 0);
        const next = this.getNextLevel(stats.exp || 0);

        /* ── Header child-name ── */
        const nameEl = document.getElementById('child-name-display');
        if (nameEl) nameEl.textContent = data.childName || 'Learner';

        /* ── Profile hero card ── */
        const pName = document.getElementById('profile-child-name');
        const pBadge = document.getElementById('profile-level-badge');
        const pLvBadge = document.getElementById('profile-lv-badge');
        if (pName) pName.textContent = data.childName || 'Learner';
        if (pBadge) pBadge.textContent = `⭐ Level ${level.level} – ${level.name}`;
        if (pLvBadge) pLvBadge.textContent = `Lv. ${level.level}`;

        /* ── Update avatar display (emoji or uploaded image) ── */
        this._applyAvatarToEl(
            document.getElementById('profile-avatar'),
            stats.avatar || level.emoji
        );

        /* ── Big EXP ring (profile page, circumference = 2π × 58 ≈ 364.4) ── */
        const RING_CIRC = 364.4;
        const ringFill = document.getElementById('profile-ring-fill');
        if (ringFill) {
            let pct = next
                ? Math.min(1, (stats.exp - level.expNeeded) / (next.expNeeded - level.expNeeded))
                : 1;
            ringFill.style.strokeDashoffset = RING_CIRC * (1 - pct);
        }

        /* ── Level milestone dots ── */
        const dots = document.querySelectorAll('.level-dot');
        dots.forEach(dot => {
            const lv = parseInt(dot.dataset.lv, 10);
            dot.classList.remove('done', 'current');
            if (lv < level.level) dot.classList.add('done');
            else if (lv === level.level) dot.classList.add('current');
        });

        /* ── Stat chips ── */
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('pstat-exp', stats.exp || 0);
        set('pstat-stars', stats.stars || 0);
        set('pstat-days', stats.loginStreak || 1);
        set('pstat-games', stats.gamesPlayed || 0);

        /* ── Home stats bar ── */
        set('home-stars', stats.stars || 0);
        set('home-exp', stats.exp || 0);
        set('home-days', stats.loginStreak || 1);
        set('home-lives', stats.lives || 20);

        /* ── EXP progress bar ── */
        if (next) {
            const fill = ((stats.exp - level.expNeeded) / (next.expNeeded - level.expNeeded)) * 100;
            const bar = document.getElementById('exp-bar-fill');
            const lbl = document.getElementById('exp-bar-label');
            if (bar) bar.style.width = `${Math.min(100, fill)}%`;
            if (lbl) lbl.textContent = `${stats.exp} / ${next.expNeeded} EXP to ${next.name}`;
        } else {
            const bar = document.getElementById('exp-bar-fill');
            const lbl = document.getElementById('exp-bar-label');
            if (bar) bar.style.width = '100%';
            if (lbl) lbl.textContent = '🏆 Max Level Reached!';
        }

        /* ── Home top-right avatar mini ring ── */
        this.renderHomeAvatar(stats.exp || 0, level, next);

        this.renderLives();
    },

    /** Update the home-page top-right profile avatar button */
    renderHomeAvatar(exp, level, next) {
        const data = KSStorage.load();
        const emojiEl = document.getElementById('home-profile-emoji');
        const lvEl = document.getElementById('home-profile-lv');
        const ringEl = document.getElementById('home-ring-fill');

        /* Apply avatar (emoji or image) */
        const avatarVal = (data && data.stats.avatar) || level.emoji;
        this._applyAvatarToEl(emojiEl, avatarVal);

        if (lvEl) lvEl.textContent = `Lv.${level.level}`;

        /* Mini ring circumference = 2π × 24 ≈ 150.8 */
        if (ringEl) {
            const MINI_CIRC = 150.8;
            let pct = next
                ? Math.min(1, (exp - level.expNeeded) / (next.expNeeded - level.expNeeded))
                : 1;
            ringEl.style.strokeDashoffset = MINI_CIRC * (1 - pct);
        }
    },

    renderLives() {
        const data = KSStorage.load();
        if (!data) return;
        const lives = data.stats.lives || 0;
        const bar = document.getElementById('lives-bar');
        if (!bar) return;

        bar.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('span');
            heart.className = `life-heart ${i < lives ? '' : 'empty'}`;
            heart.textContent = '❤️';
            bar.appendChild(heart);
        }

        const regenEl = document.getElementById('lives-regen-text');
        if (regenEl) {
            regenEl.textContent = lives < 20
                ? `❤️ ${20 - lives} lives missing — +1 auto-refill per minute!`
                : '❤️ Full lives! Play away!';
        }
    },

    renderSidebarLives() {
        const data = KSStorage.load();
        if (!data) return;
        const el = document.getElementById('lives-display');
        if (el) el.textContent = data.stats.lives ?? 0;
    },

    /** Render everything in one call */
    renderAll() {
        this.render();
        this.renderSidebarLives();
    },

    /* ═══════════════════════════════════════════════════════════════════
       CANDY CRUSH LEVEL PATH
       ═══════════════════════════════════════════════════════════════════ */

    /**
     * Render the Candy Crush–style zigzag level path.
     * @param {number} currentLevel  — the player's current level number (1–7)
     */
    renderLevelPath(currentLevel) {
        const container = document.getElementById('cc-level-path');
        if (!container) return;

        container.innerHTML = ''; /* clear previous render */

        LEVELS.forEach((lvl, idx) => {
            /* ── Connector line (not before the first node) ── */
            if (idx > 0) {
                const line = document.createElement('div');
                line.className = 'cc-connector';

                /* Mark completed connectors */
                if (lvl.level <= currentLevel) {
                    line.classList.add('cc-connector--done');
                }
                container.appendChild(line);
            }

            /* ── Level node ── */
            const node = document.createElement('div');
            node.className = 'cc-node';
            node.setAttribute('data-lv', lvl.level);

            if (lvl.level < currentLevel) {
                /* COMPLETED — glows green */
                node.classList.add('cc-node--done');
                node.innerHTML = `<span class="cc-node-check">✓</span>
                                  <span class="cc-node-num">${lvl.level}</span>`;
            } else if (lvl.level === currentLevel) {
                /* CURRENT — pulsing gold ring */
                node.classList.add('cc-node--current');
                node.innerHTML = `<span class="cc-node-emoji">${lvl.emoji}</span>
                                  <span class="cc-node-num">${lvl.level}</span>`;
            } else {
                /* FUTURE — locked/grey */
                node.classList.add('cc-node--locked');
                node.innerHTML = `<span class="cc-node-lock">🔒</span>
                                  <span class="cc-node-num">${lvl.level}</span>`;
            }

            /* Tooltip with level name */
            node.title = `Lv.${lvl.level} — ${lvl.name} (${lvl.expNeeded} EXP)`;

            container.appendChild(node);
        });
    },

    /**
     * Called on level-up. Re-renders the path with the new level number
     * so the newly unlocked node starts glowing.
     * @param {number} newLevel
     */
    unlockNextLevel(newLevel) {
        this.renderLevelPath(newLevel);
    },

    /* ═══════════════════════════════════════════════════════════════════
       AVATAR SYSTEM
       ═══════════════════════════════════════════════════════════════════ */

    /**
     * Apply either an emoji or a base64 image URL to an element.
     * If the value starts with "data:" or "http", we create/update an <img>.
     * Otherwise we set it as text (emoji).
     * @param {HTMLElement|null} el
     * @param {string} value  — emoji string or base64 data URL
     */
    _applyAvatarToEl(el, value) {
        if (!el) return;

        if (value && (value.startsWith('data:') || value.startsWith('http') || value.startsWith('blob:'))) {
            /* Image avatar */
            el.textContent = ''; /* clear any emoji text */

            /* Re-use existing img if present, else create */
            let img = el.querySelector('img.avatar-img');
            if (!img) {
                img = document.createElement('img');
                img.className = 'avatar-img';
                el.appendChild(img);
            }
            img.src = value;
            img.alt = 'Avatar';
        } else {
            /* Emoji avatar — remove any img first */
            const img = el.querySelector('img.avatar-img');
            if (img) img.remove();
            el.textContent = value || '🌟';
        }
    },

    /**
     * Load stored avatar immediately on app init so avatar appears
     * instantly without waiting for full profile render.
     */
    loadAvatar() {
        const data = KSStorage.load();
        if (!data) return;
        const avatarVal = data.stats.avatar;
        if (!avatarVal) return;

        /* Apply to all avatar display points */
        this.updateAvatarGlobally(avatarVal);
    },

    /**
     * Update every avatar display point across the SPA simultaneously.
     * @param {string} avatarValue  — emoji or base64 data URL
     */
    updateAvatarGlobally(avatarValue) {
        /* Profile hero avatar */
        this._applyAvatarToEl(document.getElementById('profile-avatar'), avatarValue);

        /* Home page mini avatar button */
        this._applyAvatarToEl(document.getElementById('home-profile-emoji'), avatarValue);
    },

    /** Open the avatar picker modal */
    showAvatarPicker() {
        const modal = document.getElementById('avatar-modal');
        const data = KSStorage.load();
        if (!modal) return;

        /* Pre-select the stored avatar as pending */
        this.pendingAvatar = (data && data.stats.avatar) || '🌟';

        /* Reset to "Choose" tab by default */
        this._switchAvatarTab('emoji');

        /* Render the emoji grid */
        this._renderEmojiGrid();

        /* Clear any previous upload preview */
        const preview = document.getElementById('avatar-upload-preview');
        if (preview) { preview.src = ''; preview.classList.add('hidden'); }
        const uploadZone = document.getElementById('avatar-upload-zone');
        if (uploadZone) uploadZone.dataset.selected = '';

        modal.classList.remove('hidden');
    },

    /** Switch between the two avatar modal tabs: 'emoji' | 'upload' */
    _switchAvatarTab(tab) {
        const emojiPane = document.getElementById('avatar-tab-emoji');
        const uploadPane = document.getElementById('avatar-tab-upload');
        const tabEmoji = document.getElementById('atab-emoji');
        const tabUpload = document.getElementById('atab-upload');

        if (tab === 'emoji') {
            if (emojiPane) emojiPane.classList.remove('hidden');
            if (uploadPane) uploadPane.classList.add('hidden');
            if (tabEmoji) tabEmoji.classList.add('active');
            if (tabUpload) tabUpload.classList.remove('active');
        } else {
            if (emojiPane) emojiPane.classList.add('hidden');
            if (uploadPane) uploadPane.classList.remove('hidden');
            if (tabEmoji) tabEmoji.classList.remove('active');
            if (tabUpload) tabUpload.classList.add('active');
        }
    },

    /** Render emoji options in the avatar grid */
    _renderEmojiGrid() {
        const grid = document.getElementById('avatar-options');
        if (!grid) return;

        grid.innerHTML = '';
        AVATARS.forEach(emoji => {
            const opt = document.createElement('div');
            opt.className = `avatar-option ${emoji === this.pendingAvatar ? 'selected' : ''}`;
            opt.textContent = emoji;
            opt.title = emoji;

            opt.addEventListener('click', () => {
                /* Store emoji as pending; clear any uploaded image */
                this.pendingAvatar = emoji;

                /* Highlight only selected */
                grid.querySelectorAll('.avatar-option').forEach(el => {
                    el.classList.toggle('selected', el.textContent === emoji);
                });
            });

            grid.appendChild(opt);
        });
    },

    /**
     * Handle a file chosen via the upload input.
     * Reads it as a base64 data URL and stores it as pendingAvatar.
     * @param {File} file
     */
    handleFileUpload(file) {
        /* Validate file type */
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
        if (!allowed.includes(file.type)) {
            KSApp.showToast('❌ Please upload a JPG, PNG, or SVG file.', 'error');
            return;
        }

        /* Validate size (max 2 MB) */
        if (file.size > 2 * 1024 * 1024) {
            KSApp.showToast('❌ Image too large (max 2 MB).', 'error');
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            /* Store the base64 data URL as the pending avatar */
            this.pendingAvatar = e.target.result;

            /* Show a preview inside the modal */
            const preview = document.getElementById('avatar-upload-preview');
            if (preview) {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
            }

            KSApp.showToast('✅ Image loaded! Click Save to apply.', 'success');
        };

        reader.onerror = () => {
            KSApp.showToast('❌ Could not read the file. Try another image.', 'error');
        };

        reader.readAsDataURL(file);
    },

    /**
     * Save the pending avatar to localStorage and update all display points.
     */
    saveAvatar() {
        /* Read which emoji/image is currently selected in the grid */
        const selectedEl = document.querySelector('.avatar-option.selected');
        if (selectedEl && !this.pendingAvatar) {
            this.pendingAvatar = selectedEl.textContent;
        }

        if (!this.pendingAvatar) {
            KSApp.showToast('Please select an avatar first! 😊', 'error');
            return;
        }

        /* 1. Persist to localStorage via KSStorage */
        const data = KSStorage.load();
        if (!data) return;
        data.stats.avatar = this.pendingAvatar;
        KSStorage.save(data);

        /* 2. Directly set emoji on DOM elements IMMEDIATELY (before renderAll) */
        const pAvatar = document.getElementById('profile-avatar');
        const hAvatar = document.getElementById('home-profile-emoji');
        const val = this.pendingAvatar;

        if (val && (val.startsWith('data:') || val.startsWith('http'))) {
            /* Image avatar — apply via _applyAvatarToEl */
            this._applyAvatarToEl(pAvatar, val);
            this._applyAvatarToEl(hAvatar, val);
        } else {
            /* Emoji avatar — set text directly, clear any leftover img */
            if (pAvatar) { pAvatar.querySelectorAll('img').forEach(i => i.remove()); pAvatar.textContent = val; }
            if (hAvatar) { hAvatar.querySelectorAll('img').forEach(i => i.remove()); hAvatar.textContent = val; }
        }

        /* 3. Re-render full profile for ring / stat sync */
        this.renderAll();

        /* 4. Close modal + notify */
        const modal = document.getElementById('avatar-modal');
        if (modal) modal.classList.add('hidden');

        KSApp.showToast(`Avatar set to ${val.startsWith('data:') ? '📷 your photo' : val}! ✨`, 'success');
    },

    /* ═══════════════════════════════════════════════════════════════════
       INIT — wire all event listeners once
       ═══════════════════════════════════════════════════════════════════ */
    init() {
        /* ── Home avatar shortcut → go to profile section ── */
        const homeBtn = document.getElementById('home-profile-btn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                document.getElementById('nav-profile')?.click();
            });
        }

        /* ── Profile avatar click → open picker modal ── */
        const avatarClick = document.getElementById('profile-avatar-click');
        if (avatarClick) {
            avatarClick.addEventListener('click', () => this.showAvatarPicker());
        }

        /* ── Avatar modal tab buttons ── */
        document.getElementById('atab-emoji')?.addEventListener('click', () => this._switchAvatarTab('emoji'));
        document.getElementById('atab-upload')?.addEventListener('click', () => this._switchAvatarTab('upload'));

        /* ── File input change ── */
        const fileInput = document.getElementById('avatar-file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) this.handleFileUpload(file);
            });
        }

        /* ── Upload zone drag & drop ── */
        const uploadZone = document.getElementById('avatar-upload-zone');
        if (uploadZone) {
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('drag-over');
            });
            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('drag-over');
            });
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('drag-over');
                const file = e.dataTransfer.files[0];
                if (file) this.handleFileUpload(file);
            });
            /* Click on zone → trigger file input */
            uploadZone.addEventListener('click', () => {
                document.getElementById('avatar-file-input')?.click();
            });
        }

        /* ── Modal cancel ── */
        document.getElementById('avatar-cancel')?.addEventListener('click', () => {
            document.getElementById('avatar-modal')?.classList.add('hidden');
        });

        /* ── Modal save ── */
        document.getElementById('avatar-save')?.addEventListener('click', () => this.saveAvatar());

        /* ── Load stored avatar immediately (before full render) ── */
        this.loadAvatar();
    }
};
