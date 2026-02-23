/**
 * KidSpark Storage Manager
 * Handles all localStorage reads/writes with encryption
 * JSON structure: { email, passwordHash, pinHash, timeLimit, childName, stats, sessionDate }
 */

const STORAGE_KEY = 'ks_user_v1';

const KSStorage = {
    /** Save user data (encrypted) */
    save(data) {
        const json = JSON.stringify(data);
        localStorage.setItem(STORAGE_KEY, KSCrypto.encrypt(json));
    },

    /** Load user data */
    load() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(KSCrypto.decrypt(raw));
        } catch { return null; }
    },

    /** Register new user */
    register({ email, password, pin, childName, timeLimit }) {
        const today = new Date().toDateString();
        const data = {
            email,
            passwordHash: KSCrypto.hash(password),
            pinHash: KSCrypto.hash(pin),
            childName: childName || 'Learner',
            baseTimeLimit: parseInt(timeLimit) || 60,
            timeLimit: parseInt(timeLimit) || 60,
            stats: {
                exp: 0,
                stars: 0,
                lives: 20,
                loginDays: 1,
                gamesPlayed: 0,
                lastLogin: today,
                loginStreak: 1,
                timeUsedToday: 0,
                lastTimerDate: today,
            },
            currentSection: 'home',
        };
        this.save(data);
        return data;
    },

    /** Check login credentials */
    login({ email, password }) {
        const data = this.load();
        if (!data) return { ok: false, reason: 'No account found. Please register.' };
        if (data.email !== email) return { ok: false, reason: 'Wrong email address!' };
        if (data.passwordHash !== KSCrypto.hash(password)) return { ok: false, reason: 'Wrong password!' };
        return { ok: true, data };
    },

    /** Verify parent PIN */
    verifyPin(pin) {
        const data = this.load();
        return data && data.pinHash === KSCrypto.hash(pin);
    },

    /** Update stats */
    updateStats(updates) {
        const data = this.load();
        if (!data) return;
        Object.assign(data.stats, updates);
        this.save(data);
    },

    /** Update settings (PIN and time limit) */
    updateSettings({ newPin, newTimeLimit }) {
        const data = this.load();
        if (!data) return;
        if (newPin) data.pinHash = KSCrypto.hash(newPin);
        if (newTimeLimit) {
            data.timeLimit = parseInt(newTimeLimit);
        }
        this.save(data);
    },

    /** Save current section for persistence */
    saveSection(section) {
        const data = this.load();
        if (!data) return;
        data.currentSection = section;
        this.save(data);
    },

    /** Handle login streak */
    handleLoginStreak() {
        const data = this.load();
        if (!data) return;
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (data.stats.lastLogin === today) return; // already logged in today

        if (data.stats.lastLogin === yesterday) {
            data.stats.loginStreak = (data.stats.loginStreak || 1) + 1;
        } else {
            data.stats.loginStreak = 1;
        }
        data.stats.loginDays = (data.stats.loginDays || 0) + 1;
        data.stats.lastLogin = today;

        // Reset daily timer
        data.stats.timeUsedToday = 0;
        data.stats.lastTimerDate = today;

        // Restore base time limit for the new day
        data.timeLimit = data.baseTimeLimit || 60;

        this.save(data);
    },

    /** Reset daily timer if new day */
    checkDailyReset() {
        const data = this.load();
        if (!data) return;
        const today = new Date().toDateString();
        if (data.stats.lastTimerDate !== today) {
            data.stats.timeUsedToday = 0;
            data.stats.lastTimerDate = today;
            // Restore base time limit for the new day
            data.timeLimit = data.baseTimeLimit || 60;
            this.save(data);
        }
    },

    /** Get remaining time in seconds */
    getRemainingTime() {
        const data = this.load();
        if (!data) return 0;
        const limitSecs = (data.timeLimit || 60) * 60;
        const usedSecs = data.stats.timeUsedToday || 0;
        return Math.max(0, limitSecs - usedSecs);
    },
};
