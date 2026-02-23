/**
 * KidSpark Profile Manager
 * Handles EXP, levels, stars, lives, and profile rendering
 */

const LEVELS = [
    { level: 1, name: 'Little Spark', expNeeded: 0, avatar: '🌟' },
    { level: 2, name: 'Curious Mind', expNeeded: 100, avatar: '🧠' },
    { level: 3, name: 'Star Reader', expNeeded: 250, avatar: '📚' },
    { level: 4, name: 'Math Wizard', expNeeded: 500, avatar: '🧙' },
    { level: 5, name: 'Super Spark', expNeeded: 800, avatar: '⚡' },
    { level: 6, name: 'Brain Hero', expNeeded: 1200, avatar: '🦸' },
    { level: 7, name: 'Knowledge King', expNeeded: 1800, avatar: '👑' },
];

const AVATARS = ['🌟', '🚀', '🎨', '🧩', '🦕', '🦉', '🐱', '🐶', '🦄', '🐯', '🤖', '👾'];

const KSProfile = {
    pendingAvatar: null,
    getLevel(exp) {
        let current = LEVELS[0];
        for (const lvl of LEVELS) {
            if (exp >= lvl.expNeeded) current = lvl;
        }
        return current;
    },

    getNextLevel(exp) {
        const idx = LEVELS.findIndex(l => l.expNeeded > exp);
        return idx === -1 ? null : LEVELS[idx];
    },

    /** Award EXP and stars */
    awardExp(amount = 15) {
        const data = KSStorage.load();
        if (!data) return;
        const prevLevel = this.getLevel(data.stats.exp);
        data.stats.exp = (data.stats.exp || 0) + amount;
        data.stats.stars = (data.stats.stars || 0) + 1;
        KSStorage.save(data);

        const newLevel = this.getLevel(data.stats.exp);
        if (newLevel.level > prevLevel.level) {
            KSApp.showToast(`🎉 LEVEL UP! You are now ${newLevel.name} ${newLevel.avatar}!`, 'success');
        } else {
            KSApp.showToast(`+${amount} EXP earned! ⭐`, 'success');
        }
        this.renderAll();
    },

    /** Deduct a life */
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

    /** Increment games played */
    gameCompleted() {
        const data = KSStorage.load();
        if (!data) return;
        data.stats.gamesPlayed = (data.stats.gamesPlayed || 0) + 1;
        KSStorage.save(data);
    },

    /** Render profile section */
    render() {
        const data = KSStorage.load();
        if (!data) return;
        const stats = data.stats;
        const level = this.getLevel(stats.exp || 0);
        const next = this.getNextLevel(stats.exp || 0);

        // Header greeting
        const nameEl = document.getElementById('child-name-display');
        if (nameEl) nameEl.textContent = data.childName || 'Learner';

        // ---- Profile hero card ----
        const pAvatar = document.getElementById('profile-avatar');
        const pName = document.getElementById('profile-child-name');
        const pBadge = document.getElementById('profile-level-badge');
        const pLvBadge = document.getElementById('profile-lv-badge');
        if (pAvatar) pAvatar.textContent = data.stats.avatar || level.avatar;
        if (pName) pName.textContent = data.childName || 'Learner';
        if (pBadge) pBadge.textContent = `⭐ Level ${level.level} – ${level.name}`;
        if (pLvBadge) pLvBadge.textContent = `Lv. ${level.level}`;

        // ---- Big SVG EXP ring (profile page) ----
        const RING_CIRC = 364.4;  // 2π × 58
        const ringFill = document.getElementById('profile-ring-fill');
        if (ringFill) {
            let pct = 0;
            if (next) {
                pct = Math.min(1, (stats.exp - level.expNeeded) / (next.expNeeded - level.expNeeded));
            } else {
                pct = 1; // max level
            }
            ringFill.style.strokeDashoffset = RING_CIRC * (1 - pct);
        }

        // ---- Level milestone dots ----
        const dots = document.querySelectorAll('.level-dot');
        dots.forEach(dot => {
            const lv = parseInt(dot.dataset.lv, 10);
            dot.classList.remove('done', 'current');
            if (lv < level.level) dot.classList.add('done');
            else if (lv === level.level) dot.classList.add('current');
        });

        // Stats
        const setPState = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setPState('pstat-exp', stats.exp || 0);
        setPState('pstat-stars', stats.stars || 0);
        setPState('pstat-days', stats.loginStreak || 1);
        setPState('pstat-games', stats.gamesPlayed || 0);

        // Home stats bar
        setPState('home-stars', stats.stars || 0);
        setPState('home-exp', stats.exp || 0);
        setPState('home-days', stats.loginStreak || 1);
        setPState('home-lives', stats.lives || 20);

        // EXP progress bar
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

        // ---- Home top-right avatar mini ring ----
        this.renderHomeAvatar(stats.exp || 0, level, next);

        this.renderLives();
    },

    /** Update the home-page top-right profile avatar button */
    renderHomeAvatar(exp, level, next) {
        const data = KSStorage.load();
        const emojiEl = document.getElementById('home-profile-emoji');
        const lvEl = document.getElementById('home-profile-lv');
        const ringEl = document.getElementById('home-ring-fill');
        if (emojiEl) emojiEl.textContent = (data && data.stats.avatar) || level.avatar;
        if (lvEl) lvEl.textContent = `Lv.${level.level}`;
        if (ringEl) {
            const MINI_CIRC = 150.8; // 2π × 24
            let pct = 0;
            if (next) {
                pct = Math.min(1, (exp - level.expNeeded) / (next.expNeeded - level.expNeeded));
            } else {
                pct = 1;
            }
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
        const lives = data.stats.lives ?? 0;
        const el = document.getElementById('lives-display');
        if (el) el.textContent = lives;
    },

    renderAll() {
        this.render();
        this.renderSidebarLives();
    },

    /** Wire home avatar button → profile section */
    init() {
        // Home profile shortcut
        const btn = document.getElementById('home-profile-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                const navProfile = document.getElementById('nav-profile');
                if (navProfile) navProfile.click();
            });
        }

        // Open avatar modal
        const avatarClick = document.getElementById('profile-avatar-click');
        if (avatarClick) {
            avatarClick.addEventListener('click', () => this.showAvatarPicker());
        }

        // Avatar modal cancel/save
        const avatarCancel = document.getElementById('avatar-cancel');
        if (avatarCancel) {
            avatarCancel.addEventListener('click', () => {
                document.getElementById('avatar-modal').classList.add('hidden');
            });
        }

        const avatarSave = document.getElementById('avatar-save');
        if (avatarSave) {
            avatarSave.addEventListener('click', () => this.saveAvatar());
        }
    },

    showAvatarPicker() {
        const modal = document.getElementById('avatar-modal');
        const grid = document.getElementById('avatar-options');
        const data = KSStorage.load();

        // Start with current avatar as pending
        this.pendingAvatar = (data && data.stats.avatar) || '🌟';

        if (!modal || !grid) return;

        grid.innerHTML = '';
        AVATARS.forEach(emoji => {
            const opt = document.createElement('div');
            opt.className = `avatar-option ${emoji === this.pendingAvatar ? 'selected' : ''}`;
            opt.textContent = emoji;
            opt.addEventListener('click', () => {
                this.pendingAvatar = emoji;
                // Highlight only the clicked one
                document.querySelectorAll('.avatar-option').forEach(el => {
                    el.classList.toggle('selected', el.textContent === emoji);
                });
            });
            grid.appendChild(opt);
        });

        modal.classList.remove('hidden');
    },

    saveAvatar() {
        if (!this.pendingAvatar) return;

        // 1. Save to persistent storage
        const data = KSStorage.load();
        if (!data) return;
        data.stats.avatar = this.pendingAvatar;
        KSStorage.save(data);

        // 2. Direct DOM updates for instant change
        const pAvatar = document.getElementById('profile-avatar');
        const hAvatar = document.getElementById('home-profile-emoji');
        if (pAvatar) pAvatar.textContent = this.pendingAvatar;
        if (hAvatar) hAvatar.textContent = this.pendingAvatar;

        // 3. Update state globally
        this.renderAll();

        // 4. Close modal and notify
        const modal = document.getElementById('avatar-modal');
        if (modal) modal.classList.add('hidden');
        KSApp.showToast('Avatar updated! ✨', 'success');
    }
};
