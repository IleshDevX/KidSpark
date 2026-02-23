/**
 * KidSpark Main App Controller
 * Handles: auth flow, sidebar navigation, page persistence, toast notifications
 */

const KSApp = {
    toastTimer: null,

    init() {
        this.checkAutoLogin();
        this.bindAuth();
        this.bindNav();
        this.bindSidebarToggle();
        this.bindHomeCards();
        this.setDailyTip();
    },

    // ─── Auth ───────────────────────────────────────────

    checkAutoLogin() {
        const data = KSStorage.load();
        if (data && data.email && data.passwordHash) {
            // Auto-login
            this.showApp(data);
        } else {
            this.showAuth();
        }
    },

    showAuth() {
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('auth-screen').classList.add('active');
        document.getElementById('main-app').classList.add('hidden');
    },

    showApp(data) {
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('auth-screen').classList.remove('active');
        document.getElementById('main-app').classList.remove('hidden');
        document.getElementById('main-app').classList.add('active');

        // Handle login streak
        KSStorage.handleLoginStreak();

        // Init subsystems
        KSProfile.renderAll();
        KSProfile.init();
        KSTimer.init();
        KSChatbot.init();
        KSImageGen.init();
        KSGames.init();
        KSParents.init();

        // Restore persisted section
        const savedSection = data.currentSection || 'home';
        this.navigateTo(savedSection);

        this.showToast(`👋 Welcome back, ${data.childName || 'Learner'}!`, 'success');
    },

    bindAuth() {
        // Toggle views
        document.getElementById('goto-register')?.addEventListener('click', e => {
            e.preventDefault();
            this.showRegisterView();
        });
        document.getElementById('goto-login')?.addEventListener('click', e => {
            e.preventDefault();
            this.showLoginView();
        });

        // Register
        document.getElementById('register-form')?.addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('reg-email')?.value?.trim();
            const password = document.getElementById('reg-password')?.value;
            const pin = document.getElementById('reg-pin')?.value;
            const childName = document.getElementById('reg-child-name')?.value?.trim();
            const timeLimit = document.getElementById('reg-time-limit')?.value;

            if (!email || !password || !pin || !childName) {
                this.showToast('Please fill in all fields!', 'error'); return;
            }
            if (password.length < 6) {
                this.showToast('Password must be at least 6 characters!', 'error'); return;
            }
            if (!/^\d{4}$/.test(pin)) {
                this.showToast('PIN must be exactly 4 digits!', 'error'); return;
            }

            const data = KSStorage.register({ email, password, pin, childName, timeLimit });
            this.showToast('🎉 Account created! Welcome to KidSpark!', 'success');
            setTimeout(() => this.showApp(data), 800);
        });

        // Login
        document.getElementById('login-form')?.addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('login-email')?.value?.trim();
            const password = document.getElementById('login-password')?.value;
            const result = KSStorage.login({ email, password });
            if (result.ok) {
                this.showToast('🌟 Login successful!', 'success');
                setTimeout(() => this.showApp(result.data), 600);
            } else {
                this.showToast(result.reason, 'error');
            }
        });
    },

    showRegisterView() {
        document.getElementById('login-view').classList.add('hidden');
        document.getElementById('register-view').classList.remove('hidden');
    },

    showLoginView() {
        document.getElementById('register-view').classList.add('hidden');
        document.getElementById('login-view').classList.remove('hidden');
    },

    // ─── Navigation ──────────────────────────────────────

    bindNav() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                // Parents section needs PIN verification every time
                if (section === 'parents') {
                    KSParents.resetLock();
                }
                this.navigateTo(section);
            });
        });
    },

    navigateTo(section) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(el => {
            el.classList.remove('active');
            el.classList.add('hidden');
        });

        // Show target
        const target = document.getElementById(`section-${section}`);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active');
        }

        // Update nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });

        // Notify timer — only ticks in Games section
        KSTimer.onSectionChange(section);

        // Section-specific actions
        if (section === 'profile') KSProfile.renderAll();
        if (section === 'chatbot') {
            const panel = document.getElementById('chatbot-answer-panel');
            if (panel) panel.classList.add('hidden');
        }
        if (section === 'games') {
            KSGames.exitGame();
        }

        // Persist section
        KSStorage.saveSection(section);
    },

    bindSidebarToggle() {
        const logo = document.querySelector('.logo-spark-sm');
        const sidebar = document.getElementById('sidebar');
        const main = document.getElementById('main-content');
        if (logo && sidebar) {
            logo.style.cursor = 'pointer';
            logo.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                const isCollapsed = sidebar.classList.contains('collapsed');
                if (main) {
                    main.style.marginLeft = isCollapsed
                        ? 'var(--sidebar-w-collapsed)'
                        : 'var(--sidebar-w)';
                }
                // Update answer panel too
                const panel = document.getElementById('chatbot-answer-panel');
                if (panel) panel.style.left = isCollapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)';
            });
        }
    },

    bindHomeCards() {
        document.querySelectorAll('.home-card').forEach(card => {
            const goto = card.dataset.goto;
            if (goto) card.addEventListener('click', () => this.navigateTo(goto));
        });
    },

    setDailyTip() {
        const tips = DAILY_TIPS;
        const tip = tips[new Date().getDay() % tips.length];
        const el = document.getElementById('daily-tip-text');
        if (el) el.textContent = tip;
    },

    // ─── Toast ───────────────────────────────────────────

    showToast(msg, type = '') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.className = `toast ${type}`;
        if (this.toastTimer) clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
};

// ─── DOM Ready ────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    KSApp.init();
});
