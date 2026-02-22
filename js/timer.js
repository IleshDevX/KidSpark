/**
 * KidSpark Timer
 * - Counts down ONLY when the Games section is active
 * - Pauses automatically when navigating to other sections
 * - Shows overlay when time expires (only blocks Games)
 * - Parents can increase time limit → timer refreshes immediately, overlay hides
 * - Resets automatically each new day
 * - Lives auto-recharge: +1 life per minute (up to 20)
 */

const KSTimer = {
    intervalId: null,
    livesIntervalId: null,
    remainingSeconds: 0,
    paused: true,          // starts paused — only ticks when in Games
    isGamesSection: false, // tracks whether Games section is currently shown

    init() {
        KSStorage.checkDailyReset();
        this.remainingSeconds = KSStorage.getRemainingTime();
        this.renderTimer();
        this.start();
        this.startLivesRecharge();
    },

    /** Called by app.js whenever section changes */
    onSectionChange(section) {
        this.isGamesSection = (section === 'games');
        if (this.isGamesSection) {
            this.resume();
        } else {
            this.pause();
        }
    },

    start() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
            if (this.paused) return;            // ← only ticks in Games

            if (this.remainingSeconds <= 0) {
                this.onTimeUp();
                return;
            }
            this.remainingSeconds--;
            this.renderTimer();

            // Save every 30 seconds
            if (this.remainingSeconds % 30 === 0) {
                this.saveUsedTime();
            }
        }, 1000);
    },

    saveUsedTime() {
        const data = KSStorage.load();
        if (!data) return;
        const limitSecs = (data.timeLimit || 60) * 60;
        const usedSecs = limitSecs - this.remainingSeconds;
        KSStorage.updateStats({ timeUsedToday: Math.max(0, usedSecs) });
    },

    renderTimer() {
        const mins = Math.floor(this.remainingSeconds / 60);
        const secs = this.remainingSeconds % 60;
        const display = `${mins}:${secs.toString().padStart(2, '0')}`;
        const el = document.getElementById('timer-display');
        if (el) el.textContent = display;

        // Color warning when < 5 min
        if (el) el.style.color = this.remainingSeconds < 300 ? '#D51D48' : '';
    },

    onTimeUp() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.saveUsedTime();

        // Show overlay (only if still in Games section)
        const overlay = document.getElementById('time-limit-overlay');
        if (overlay) overlay.classList.remove('hidden');

        // Disable the games grid so child can't interact
        const gamesSection = document.getElementById('section-games');
        if (gamesSection) {
            gamesSection.style.pointerEvents = 'none';
            gamesSection.style.opacity = '0.6';
        }

        this.paused = true;
    },

    /**
     * Called by parents.js after a new time limit is saved.
     * Refreshes remaining time, hides overlay, re-enables games section.
     */
    refreshAfterParentUpdate() {
        KSStorage.checkDailyReset();
        this.remainingSeconds = KSStorage.getRemainingTime();
        this.renderTimer();

        // Hide the overlay if it was showing
        const overlay = document.getElementById('time-limit-overlay');
        if (overlay) overlay.classList.add('hidden');

        // Re-enable games section
        const gamesSection = document.getElementById('section-games');
        if (gamesSection) {
            gamesSection.style.pointerEvents = '';
            gamesSection.style.opacity = '';
        }

        // Restart the tick loop
        if (!this.intervalId) this.start();

        // Resume only if we're in Games
        if (this.isGamesSection) {
            this.paused = false;
        } else {
            this.paused = true;
        }
    },

    pause() {
        this.paused = true;
        this.saveUsedTime();  // save progress whenever we pause
    },

    resume() {
        // Don't resume if time has already run out
        if (this.remainingSeconds <= 0) return;
        this.paused = false;
        // Ensure tick loop is running
        if (!this.intervalId) this.start();
    },

    startLivesRecharge() {
        if (this.livesIntervalId) clearInterval(this.livesIntervalId);
        this.livesIntervalId = setInterval(() => {
            const data = KSStorage.load();
            if (!data) return;
            const lives = data.stats.lives || 0;
            if (lives < 20) {
                KSStorage.updateStats({ lives: Math.min(20, lives + 1) });
                KSProfile.renderLives();
                KSProfile.renderSidebarLives();
                KSApp.showToast('❤️ +1 Life recharged!', 'success');
            }
        }, 60000); // Every 60 seconds
    },

    destroy() {
        if (this.intervalId) clearInterval(this.intervalId);
        if (this.livesIntervalId) clearInterval(this.livesIntervalId);
        this.intervalId = null;
        this.livesIntervalId = null;
    }
};
