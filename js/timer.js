/**
 * KidSpark Game Timer Module
 * ─────────────────────────────────────────────────────────────────────────────
 * Responsibilities:
 *  - Counts down ONLY when the Games section is active AND a game is running
 *  - Persists remaining time in localStorage so page refresh does NOT reset it
 *  - Shows a "Time Over" modal when time expires; blocks new games from opening
 *  - Stops automatically when the user closes a game or switches sidebar section
 *  - Lives auto-recharge: +1 life per minute (up to 20)
 *  - Parents can refresh the limit → timer resets and overlay hides
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Public API
 * ──────────
 *  KSTimer.startTimer()   — Begin / resume the countdown
 *  KSTimer.stopTimer()    — Pause the countdown and immediately save progress
 *  KSTimer.resetTimer()   — Reset remaining time from the stored time-limit config
 *  KSTimer.saveTime()     — Persist current remaining seconds to localStorage
 *  KSTimer.loadTime()     — Load remaining seconds from localStorage
 *  KSTimer.init()         — Bootstrap: load saved time, wire recharge, start ticking
 *  KSTimer.onSectionChange(section) — Called by app.js on sidebar nav change
 *  KSTimer.refreshAfterParentUpdate() — Called by parents.js after limit change
 */

const KSTimer = {

    /* ── Internal state ─────────────────────────────────────── */
    intervalId: null,       // handle for the 1-second tick setInterval
    livesIntervalId: null,  // handle for the 1-minute lives-recharge setInterval
    remainingSeconds: 0,    // live countdown value (updated every tick)
    paused: true,           // true → tick fires but does nothing (timer is idle)
    isGamesSection: false,  // whether the Games nav section is currently visible

    /* ================================================================
       INIT — called once by app.js after login
       ================================================================ */
    init() {
        /* 1. Make sure daily reset has been evaluated */
        KSStorage.checkDailyReset();

        /* 2. Load saved remaining time (survives page refresh) */
        this.remainingSeconds = this.loadTime();

        /* 3. Render the sidebar timer display immediately */
        this.renderTimer();

        /* 4. Start the internal tick loop (it won't actually count down
              until startTimer() is called and paused = false) */
        this._startTickLoop();

        /* 5. Begin the lives auto-recharge loop */
        this.startLivesRecharge();
    },

    /* ================================================================
       LOAD TIME — read remaining seconds from localStorage
       ================================================================ */
    loadTime() {
        /* KSStorage already computes: limitSecs − usedSecs */
        return KSStorage.getRemainingTime();
    },

    /* ================================================================
       SAVE TIME — persist current progress back to localStorage
       ================================================================ */
    saveTime() {
        const data = KSStorage.load();
        if (!data) return;

        /* Convert remaining back to "used" which is what KSStorage tracks */
        const limitSecs = (data.timeLimit || 60) * 60;
        const usedSecs = limitSecs - this.remainingSeconds;
        KSStorage.updateStats({ timeUsedToday: Math.max(0, usedSecs) });
    },

    /* ================================================================
       START TIMER — begin counting down from current remainingSeconds
       ================================================================ */
    startTimer() {
        /* Guard: if time is already up, show the modal instead */
        if (this.remainingSeconds <= 0) {
            this._showTimeOverModal();
            return;
        }

        /* Un-pause so that the tick loop actually decrements */
        this.paused = false;

        /* Ensure the tick loop is running (may have been cleared) */
        this._startTickLoop();
    },

    /* ================================================================
       STOP TIMER — pause the countdown and persist progress
       ================================================================ */
    stopTimer() {
        /* Freeze the countdown */
        this.paused = true;

        /* Immediately write current progress to localStorage */
        this.saveTime();
    },

    /* ================================================================
       RESET TIMER — reload the full remaining time from the config
                     (used after a parent updates the time limit)
       ================================================================ */
    resetTimer() {
        KSStorage.checkDailyReset();
        this.remainingSeconds = this.loadTime();
        this.renderTimer();
    },

    /* ================================================================
       INTERNAL — the 1-second tick loop
                  Runs continuously; only decrements when not paused
       ================================================================ */
    _startTickLoop() {
        /* Prevent duplicate intervals */
        if (this.intervalId) clearInterval(this.intervalId);

        this.intervalId = setInterval(() => {
            /* Only tick when the timer is actively running */
            if (this.paused) return;

            /* Check if time has run out */
            if (this.remainingSeconds <= 0) {
                this._onTimeUp();
                return;
            }

            /* Decrement by one second */
            this.remainingSeconds--;

            /* Update the sidebar display */
            this.renderTimer();

            /* Persist to localStorage every 10 seconds to reduce I/O */
            if (this.remainingSeconds % 10 === 0) {
                this.saveTime();
            }
        }, 1000);
    },

    /* ================================================================
       SECTION CHANGE — called by app.js whenever sidebar nav changes
       ================================================================ */
    onSectionChange(section) {
        this.isGamesSection = (section === 'games');

        if (this.isGamesSection) {
            /* Entering Games section: timer is ready but NOT started yet —
               it starts only when a game-card is actually clicked */
            /* Do nothing; startTimer() is called from games.js */
        } else {
            /* Leaving Games → stop the timer immediately */
            this.stopTimer();
        }
    },

    /* ================================================================
       TIME-UP HANDLER — fires when remainingSeconds hits 0
       ================================================================ */
    _onTimeUp() {
        /* Stop the tick loop */
        clearInterval(this.intervalId);
        this.intervalId = null;

        /* Final save so usage is recorded */
        this.saveTime();

        /* Force remaining to 0 for all guards */
        this.remainingSeconds = 0;
        this.renderTimer();

        /* Freeze the timer */
        this.paused = true;

        /* Show the "Time Over" modal */
        this._showTimeOverModal();

        /* Dim & disable the games grid so the child cannot interact */
        const gamesSection = document.getElementById('section-games');
        if (gamesSection) {
            gamesSection.style.pointerEvents = 'none';
            gamesSection.style.opacity = '0.6';
        }
    },

    /* ================================================================
       TIME OVER MODAL — shown when time runs out or game-card is
       clicked with 0 remaining seconds
       ================================================================ */
    _showTimeOverModal() {
        const modal = document.getElementById('timeover-modal');
        if (modal) modal.classList.remove('hidden');
    },

    /* ================================================================
       RENDER TIMER — update the sidebar ⏱ display
       ================================================================ */
    renderTimer() {
        const mins = Math.floor(this.remainingSeconds / 60);
        const secs = this.remainingSeconds % 60;
        const display = `${mins}:${secs.toString().padStart(2, '0')}`;

        const el = document.getElementById('timer-display');
        if (el) {
            el.textContent = display;
            /* Red warning when less than 5 minutes remain */
            el.style.color = this.remainingSeconds < 300 ? '#D51D48' : '';
        }
    },

    /* ================================================================
       PARENT UPDATE — called by parents.js after new time limit saved
       ================================================================ */
    refreshAfterParentUpdate() {
        /* Reload fresh remaining time */
        this.resetTimer();

        /* Hide Time Over modal if it was showing */
        const modal = document.getElementById('timeover-modal');
        if (modal) modal.classList.add('hidden');

        /* Hide the legacy time-limit overlay too */
        const overlay = document.getElementById('time-limit-overlay');
        if (overlay) overlay.classList.add('hidden');

        /* Re-enable the games section */
        const gamesSection = document.getElementById('section-games');
        if (gamesSection) {
            gamesSection.style.pointerEvents = '';
            gamesSection.style.opacity = '';
        }

        /* Restart the tick loop if it was cleared */
        if (!this.intervalId) this._startTickLoop();

        /* Keep paused unless we are currently inside a game */
        if (!this.isGamesSection) this.paused = true;
    },

    /* ================================================================
       LIVES RECHARGE — +1 life per minute, capped at 20
       ================================================================ */
    startLivesRecharge() {
        /* Clear any stale interval */
        if (this.livesIntervalId) clearInterval(this.livesIntervalId);

        this.livesIntervalId = setInterval(() => {
            const data = KSStorage.load();
            if (!data) return;

            const lives = data.stats.lives || 0;
            if (lives < 20) {
                /* Increment by 1 and save */
                KSStorage.updateStats({ lives: Math.min(20, lives + 1) });

                /* Refresh UI */
                KSProfile.renderLives();
                KSProfile.renderSidebarLives();
                KSApp.showToast('❤️ +1 Life recharged!', 'success');
            }
        }, 60000); /* every 60 seconds */
    },

    /* ================================================================
       DESTROY — clean up all intervals (e.g. on logout)
       ================================================================ */
    destroy() {
        if (this.intervalId) clearInterval(this.intervalId);
        if (this.livesIntervalId) clearInterval(this.livesIntervalId);
        this.intervalId = null;
        this.livesIntervalId = null;
    }
};
