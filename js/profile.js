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

const KSProfile = {
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

        // Header
        const nameEl = document.getElementById('child-name-display');
        if (nameEl) nameEl.textContent = data.childName || 'Learner';

        // Profile card
        const pAvatar = document.getElementById('profile-avatar');
        const pName = document.getElementById('profile-child-name');
        const pBadge = document.getElementById('profile-level-badge');
        if (pAvatar) pAvatar.textContent = level.avatar;
        if (pName) pName.textContent = data.childName || 'Learner';
        if (pBadge) pBadge.textContent = `⭐ Level ${level.level} – ${level.name}`;

        // Stats
        const setPState = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setPState('pstat-exp', stats.exp || 0);
        setPState('pstat-stars', stats.stars || 0);
        setPState('pstat-days', stats.loginStreak || 1);
        setPState('pstat-games', stats.gamesPlayed || 0);

        // Home stats
        setPState('home-stars', stats.stars || 0);
        setPState('home-exp', stats.exp || 0);
        setPState('home-days', stats.loginStreak || 1);
        setPState('home-lives', stats.lives || 20);

        // EXP bar
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

        this.renderLives();
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
    }
};
