/**
 * KidSpark Parents Portal
 * PIN-gated access, clear stats display, settings, PDF download
 */

const KSParents = {
    unlocked: false,
    barChart: null,
    pieChart: null,

    init() {
        this.bindPinVerify();
        this.bindTabs();
        this.bindSettings();
        this.bindReport();
        this.bindLockout();
    },

    bindPinVerify() {
        const verifyBtn = document.getElementById('verify-pin-btn');
        const pinInput = document.getElementById('parent-pin-input');
        const errEl = document.getElementById('pin-error');
        if (verifyBtn) verifyBtn.addEventListener('click', () => this.verifyPin(pinInput, errEl));
        if (pinInput) pinInput.addEventListener('keydown', e => { if (e.key === 'Enter') this.verifyPin(pinInput, errEl); });
    },

    verifyPin(input, errEl) {
        const pin = input?.value?.trim();
        if (!pin || pin.length !== 4) {
            if (errEl) { errEl.textContent = '❌ Please enter a 4-digit PIN'; errEl.classList.remove('hidden'); }
            return;
        }
        if (KSStorage.verifyPin(pin)) {
            this.unlock();
            if (errEl) errEl.classList.add('hidden');
            if (input) input.value = '';
        } else {
            if (errEl) { errEl.textContent = '❌ Wrong PIN. Try again!'; errEl.classList.remove('hidden'); }
            if (input) { input.value = ''; input.focus(); }
            const gate = document.querySelector('.pin-gate-card');
            if (gate) { gate.style.animation = 'shake 0.4s ease'; setTimeout(() => gate.style.animation = '', 500); }
        }
    },

    unlock() {
        this.unlocked = true;
        const gate = document.getElementById('parents-pin-gate');
        const dash = document.getElementById('parents-dashboard');
        if (gate) gate.style.display = 'none';
        if (dash) dash.classList.remove('hidden');
        this.loadStats();
    },

    lock() {
        this.unlocked = false;
        const gate = document.getElementById('parents-pin-gate');
        const dash = document.getElementById('parents-dashboard');
        if (gate) gate.style.display = '';
        if (dash) dash.classList.add('hidden');
        const input = document.getElementById('parent-pin-input');
        if (input) input.value = '';
        if (this.barChart) { this.barChart.destroy(); this.barChart = null; }
        if (this.pieChart) { this.pieChart.destroy(); this.pieChart = null; }
    },

    loadStats() {
        const data = KSStorage.load();
        if (!data) return;
        const s = data.stats;
        const level = KSProfile.getLevel(s.exp || 0);

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('ps-child-name', data.childName || 'Learner');
        set('ps-exp', s.exp || 0);
        set('ps-stars', s.stars || 0);
        set('ps-level', `${level.level} – ${level.name}`);
        set('ps-days', s.loginStreak || 1);
        set('ps-games', s.gamesPlayed || 0);
        set('ps-time-used', `${Math.floor((s.timeUsedToday || 0) / 60)} min`);
        set('ps-time-limit', `${data.timeLimit || 60} min`);

        // Render stat summary cards
        this.renderStatSummary(s, data);

        // Render charts after a short delay to ensure canvas is visible
        setTimeout(() => this.renderCharts(s, data), 120);
    },

    renderStatSummary(s, data) {
        const container = document.getElementById('ps-stat-summary');
        if (!container) return;

        const timeUsedMin = Math.floor((s.timeUsedToday || 0) / 60);
        const timeLimitMin = data.timeLimit || 60;
        const timeLeftMin = Math.max(0, timeLimitMin - timeUsedMin);
        const pct = timeLimitMin > 0 ? Math.min(100, Math.round((timeUsedMin / timeLimitMin) * 100)) : 0;
        const level = KSProfile.getLevel(s.exp || 0);

        container.innerHTML = `
            <div class="ps-summary-grid">

                <div class="ps-summary-card ps-card-green">
                    <div class="ps-card-icon">⏰</div>
                    <div class="ps-card-body">
                        <div class="ps-card-title">Games Time Today</div>
                        <div class="ps-card-value">${timeUsedMin} <span class="ps-card-unit">min used</span></div>
                        <div class="ps-card-sub">out of ${timeLimitMin} min allowed</div>
                        <div class="ps-time-bar-wrap">
                            <div class="ps-time-bar" style="width:${pct}%" title="${pct}% used"></div>
                        </div>
                        <div class="ps-card-note">⏳ ${timeLeftMin} min left today · Resets to original daily limit tomorrow</div>
                    </div>
                </div>

                <div class="ps-summary-card ps-card-blue">
                    <div class="ps-card-icon">🎮</div>
                    <div class="ps-card-body">
                        <div class="ps-card-title">Games Played</div>
                        <div class="ps-card-value">${s.gamesPlayed || 0} <span class="ps-card-unit">games</span></div>
                        <div class="ps-card-sub">Each game earns +15 EXP &amp; +1 Star ⭐</div>
                        <div class="ps-card-note">🔤 ABC, 🔢 Numbers, ➕ Maths &amp; more</div>
                    </div>
                </div>

                <div class="ps-summary-card ps-card-purple">
                    <div class="ps-card-icon">💎</div>
                    <div class="ps-card-body">
                        <div class="ps-card-title">EXP Points &amp; Level</div>
                        <div class="ps-card-value">${s.exp || 0} <span class="ps-card-unit">EXP</span></div>
                        <div class="ps-card-sub">Current Level: ${level.level} – ${level.name}</div>
                        <div class="ps-card-note">📈 More EXP = higher level, more achievements</div>
                    </div>
                </div>

                <div class="ps-summary-card ps-card-orange">
                    <div class="ps-card-icon">🔥</div>
                    <div class="ps-card-body">
                        <div class="ps-card-title">Login Streak</div>
                        <div class="ps-card-value">${s.loginStreak || 1} <span class="ps-card-unit">days</span></div>
                        <div class="ps-card-sub">Total login days: ${s.loginDays || 1}</div>
                        <div class="ps-card-note">🌟 Learning every day builds good habits!</div>
                    </div>
                </div>

            </div>`;
    },

    renderCharts(s, data) {
        if (typeof Chart === 'undefined') return;

        const timeUsedMin = Math.floor((s.timeUsedToday || 0) / 60);
        const timeLimitMin = data.timeLimit || 60;
        const timeRemaining = Math.max(0, timeLimitMin - timeUsedMin);

        Chart.defaults.font = { family: "'Nunito', sans-serif", weight: '700' };

        // ── Bar Chart: Games & Learning progress ──
        const barCtx = document.getElementById('stats-bar-chart')?.getContext('2d');
        if (barCtx) {
            if (this.barChart) this.barChart.destroy();
            this.barChart = new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: ['EXP\n(learning points)', 'Stars\n(rewards)', 'Games\nPlayed', 'Login\nDays'],
                    datasets: [{
                        label: 'Your child\'s progress',
                        data: [s.exp || 0, s.stars || 0, s.gamesPlayed || 0, s.loginStreak || 1],
                        backgroundColor: ['#9ccD62', '#DABE85', '#74404c', '#D51D48'],
                        borderRadius: 12,
                        borderSkipped: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: '📊 Learning Progress Overview',
                            font: { size: 13, weight: '800', family: "'Baloo 2', 'Nunito', sans-serif" },
                            color: '#3A3c42',
                            padding: { bottom: 8 }
                        },
                        tooltip: {
                            callbacks: {
                                label(ctx) {
                                    const tips = [
                                        'EXP: earned by completing games (+15 per game)',
                                        'Stars: rewards for correct answers',
                                        'Games: total games finished',
                                        'Login Days: how many days in a row',
                                    ];
                                    return ` ${ctx.parsed.y}  ←  ${tips[ctx.dataIndex] || ''}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(58,60,66,0.08)' },
                            ticks: { color: '#3A3c42', font: { weight: '700' } },
                            title: { display: true, text: 'Count / Points', color: '#888', font: { size: 11 } }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#3A3c42', font: { weight: '700', size: 10 } }
                        }
                    }
                }
            });
        }

        // ── Pie/Doughnut Chart: Games screen time ──
        const pieCtx = document.getElementById('stats-pie-chart')?.getContext('2d');
        if (pieCtx) {
            if (this.pieChart) this.pieChart.destroy();
            this.pieChart = new Chart(pieCtx, {
                type: 'doughnut',
                data: {
                    labels: [
                        `Used: ${timeUsedMin} min`,
                        `Remaining: ${timeRemaining} min`
                    ],
                    datasets: [{
                        data: [timeUsedMin || 0, timeRemaining || timeLimitMin],
                        backgroundColor: ['#D51D48', '#9ccD62'],
                        borderColor: ['#fff', '#fff'],
                        borderWidth: 3,
                        hoverOffset: 8,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#3A3c42',
                                font: { weight: '700', size: 12 },
                                padding: 14,
                                usePointStyle: true,
                            }
                        },
                        title: {
                            display: true,
                            text: `⏱️ Games Time (Limit: ${timeLimitMin} min/day)`,
                            font: { size: 13, weight: '800', family: "'Baloo 2', 'Nunito', sans-serif" },
                            color: '#3A3c42',
                            padding: { bottom: 8 }
                        },
                        tooltip: {
                            callbacks: {
                                label(ctx) {
                                    const isUsed = ctx.dataIndex === 0;
                                    return isUsed
                                        ? ` ${ctx.label} — games played so far today`
                                        : ` ${ctx.label} — still available today`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Draw center text on the doughnut
        this.drawDoughnutCenter(timeUsedMin, timeLimitMin);
    },

    /** Draws a center label inside the doughnut showing percentage used */
    drawDoughnutCenter(usedMin, limitMin) {
        const canvas = document.getElementById('stats-pie-chart');
        if (!canvas) return;
        // We rely on Chart.js plugin API via afterDraw — attach once
        // (This is a lightweight approach using an overlay label div)
        let label = document.getElementById('pie-center-label');
        if (!label) {
            label = document.createElement('div');
            label.id = 'pie-center-label';
            label.style.cssText = `
                position:absolute; top:50%; left:50%;
                transform:translate(-50%,-68%);
                text-align:center; pointer-events:none;
                font-family:'Nunito',sans-serif;
            `;
            canvas.parentElement.style.position = 'relative';
            canvas.parentElement.appendChild(label);
        }
        const pct = limitMin > 0 ? Math.min(100, Math.round((usedMin / limitMin) * 100)) : 0;
        label.innerHTML = `<div style="font-size:1.4rem;font-weight:900;color:#3A3c42">${pct}%</div>
                           <div style="font-size:0.65rem;color:#888;font-weight:700">used</div>`;
    },

    bindTabs() {
        const tabs = document.querySelectorAll('.parents-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.ptab;
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.parents-tab-content').forEach(c => c.classList.add('hidden'));
                const content = document.getElementById(`parents-${target}-tab`);
                if (content) content.classList.remove('hidden');
                if (target === 'stats') this.loadStats();
            });
        });
    },

    bindSettings() {
        const saveBtn = document.getElementById('save-settings-btn');
        const successEl = document.getElementById('settings-success');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const newPin = document.getElementById('new-pin')?.value?.trim();
                const newLimit = document.getElementById('new-time-limit')?.value?.trim();
                if (!newPin && !newLimit) { KSApp.showToast('No changes to save.', ''); return; }
                if (newPin && newPin.length !== 4) { KSApp.showToast('PIN must be 4 digits!', 'error'); return; }

                KSStorage.updateSettings({ newPin: newPin || null, newTimeLimit: newLimit || null });

                // ✅ Refresh timer immediately so the new limit takes effect now
                // (child can keep playing games without needing to reload the page)
                KSTimer.refreshAfterParentUpdate();

                if (successEl) {
                    successEl.textContent = newLimit
                        ? `✅ Saved! New limit: ${newLimit} min (Active for TODAY only)`
                        : '✅ Settings saved!';
                    successEl.classList.remove('hidden');
                }
                setTimeout(() => successEl?.classList.add('hidden'), 4000);
                KSApp.showToast('✅ Settings saved! Timer updated.', 'success');
                if (newPin) document.getElementById('new-pin').value = '';
                if (newLimit) document.getElementById('new-time-limit').value = '';
            });
        }
    },

    bindReport() {
        const dlBtn = document.getElementById('download-report-btn');
        if (dlBtn) dlBtn.addEventListener('click', () => this.downloadReport());
    },

    bindLockout() {
        const lockBtn = document.getElementById('parents-logout-btn');
        if (lockBtn) lockBtn.addEventListener('click', () => this.lock());
    },

    downloadReport() {
        const data = KSStorage.load();
        if (!data) return;
        const s = data.stats;
        const level = KSProfile.getLevel(s.exp || 0);

        // ── Date / Time ────────────────────────────────────────────
        const now = new Date();
        const displayDate = now.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
        const displayTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const yyyy = now.getFullYear();
        const hh = String(now.getHours()).padStart(2, '0');
        const mn = String(now.getMinutes()).padStart(2, '0');
        const filename = `KidSpark ${dd} ${mm} ${yyyy} ${hh} ${mn}.pdf`;

        // ── Locate jsPDF ───────────────────────────────────────────
        let jsPDFClass = null;
        try {
            if (window.jspdf && window.jspdf.jsPDF) jsPDFClass = window.jspdf.jsPDF;
            else if (window.jsPDF) jsPDFClass = window.jsPDF;
        } catch (e) { /* ignore */ }

        if (!jsPDFClass) {
            KSApp.showToast('PDF library not loaded — check internet & try again.', 'error');
            return;
        }

        try {
            const doc = new jsPDFClass();

            // ── Brand palette ──────────────────────────────────────
            const C = {
                dark: [58, 60, 66],
                green: [156, 205, 98],
                cream: [247, 248, 226],
                sand: [223, 222, 202],
                red: [213, 29, 72],
                gold: [218, 190, 133],
                plum: [116, 64, 76],
                white: [255, 255, 255],
                grey: [130, 130, 130],
                ltgrey: [240, 240, 235],
            };

            const W = 210; // page width mm
            const timeUsedMin = Math.floor((s.timeUsedToday || 0) / 60);
            const timeLimitMin = data.timeLimit || 60;
            const timeLeftMin = Math.max(0, timeLimitMin - timeUsedMin);
            const timePct = timeLimitMin > 0 ? Math.min(1, timeUsedMin / timeLimitMin) : 0;
            const expPct = Math.min(1, ((s.exp || 0) % 100) / 100);

            // ════════════════════════════════════════════════════════
            //  PAGE 1 — Summary dashboard (like the Stats tab in app)
            // ════════════════════════════════════════════════════════

            // ── Dark header strip ──────────────────────────────────
            doc.setFillColor(...C.dark);
            doc.rect(0, 0, W, 38, 'F');

            // Top-left: KidSpark logo text
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(26);
            doc.setTextColor(...C.green);
            doc.text('KidSpark', 10, 17);

            // Tagline
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...C.cream);
            doc.text('Igniting Curiosity, Guiding Growth', 10, 25);

            // Top-right: Report label + date
            doc.setFontSize(8.5);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...C.gold);
            doc.text('Learning Progress Report', W - 10, 14, { align: 'right' });
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(...C.cream);
            doc.text(`${displayDate}  |  ${displayTime}`, W - 10, 21, { align: 'right' });

            // Green accent line under header
            doc.setFillColor(...C.green);
            doc.rect(0, 38, W, 1.5, 'F');

            // ── Child name badge (centred below header) ────────────
            doc.setFillColor(...C.ltgrey);
            doc.roundedRect(12, 44, W - 24, 14, 3, 3, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(...C.dark);
            doc.text('Child:', 18, 53);
            doc.setFontSize(11);
            doc.setTextColor(...C.plum);
            doc.text(data.childName || 'Learner', 35, 53);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(...C.grey);
            doc.text('Level: ' + level.level + '  -  ' + level.name, W - 18, 53, { align: 'right' });

            // ── Section label ──────────────────────────────────────
            let y = 63;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(...C.dark);
            doc.text('TODAY\'S OVERVIEW', 12, y);
            doc.setFillColor(...C.green);
            doc.rect(12, y + 1.5, 55, 0.8, 'F');
            y += 7;

            // ── Helper: draw a stat card ───────────────────────────
            // Each card: x, y, w, h, accent color, title, value, unit, note, barPct (0-1 or null)
            const card = (cx, cy, cw, ch, accentRGB, title, value, unit, note, barPct) => {
                // Card background
                doc.setFillColor(255, 255, 255);
                doc.roundedRect(cx, cy, cw, ch, 3, 3, 'F');
                // Card shadow (simulate with thin border)
                doc.setDrawColor(220, 220, 215);
                doc.setLineWidth(0.3);
                doc.roundedRect(cx, cy, cw, ch, 3, 3, 'S');
                // Left accent bar
                doc.setFillColor(...accentRGB);
                doc.roundedRect(cx, cy, 3.5, ch, 1.5, 1.5, 'F');
                // Title
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(7);
                doc.setTextColor(...C.grey);
                doc.text(title.toUpperCase(), cx + 7, cy + 7);
                // Value
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(18);
                doc.setTextColor(...C.dark);
                doc.text(String(value), cx + 7, cy + 18);
                // Unit
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(...C.plum);
                const valW = doc.getTextWidth(String(value)) * (18 / 10) * 0.4;
                doc.text(unit, cx + 7 + valW + 2, cy + 18);
                // Note
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(7);
                doc.setTextColor(...C.grey);
                const noteLines = doc.splitTextToSize(note, cw - 14);
                let ny = cy + 24;
                noteLines.forEach(l => { doc.text(l, cx + 7, ny); ny += 4.5; });
                // Progress bar
                if (barPct !== null) {
                    const bx = cx + 7;
                    const bw = cw - 14;
                    const by = cy + ch - 8;
                    doc.setFillColor(...C.ltgrey);
                    doc.roundedRect(bx, by, bw, 3.5, 1.5, 1.5, 'F');
                    if (barPct > 0) {
                        const fillW = Math.max(3, bw * barPct);
                        // gradient effect: use accent for fill
                        doc.setFillColor(...accentRGB);
                        doc.roundedRect(bx, by, fillW, 3.5, 1.5, 1.5, 'F');
                    }
                }
            };

            // 4 stat cards in a 2x2 grid
            const cardW = (W - 30) / 2;   // ~90mm each
            const cardH = 44;
            const col1 = 12;
            const col2 = col1 + cardW + 6;
            const row1 = y;
            const row2 = y + cardH + 5;

            // Card 1: Games Time Today (green)
            card(col1, row1, cardW, cardH, C.green,
                'Games Time Today',
                timeUsedMin, 'min used',
                'Out of ' + timeLimitMin + ' min allowed today. Resets each new day.',
                timePct);

            // Card 2: Games Played (plum/maroon)
            card(col2, row1, cardW, cardH, C.plum,
                'Games Played',
                s.gamesPlayed || 0, 'games',
                'Each game earns +15 EXP and +1 Star. Games: ABC, Numbers, Maths & more.',
                null);

            // Card 3: EXP Points (gold)
            card(col1, row2, cardW, cardH, C.gold,
                'EXP Points',
                s.exp || 0, 'EXP',
                'Level ' + level.level + ' - ' + level.name + '. Higher EXP = higher level.',
                expPct);

            // Card 4: Login Streak (red)
            card(col2, row2, cardW, cardH, C.red,
                'Login Streak',
                s.loginStreak || 1, 'days',
                'Learning every day builds great habits! Total login days: ' + (s.loginDays || 1) + '.',
                null);

            y = row2 + cardH + 10;

            // ── Screen time visual bar (full width) ───────────────
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(...C.dark);
            doc.text('GAMES SCREEN TIME — TODAY', 12, y);
            doc.setFillColor(...C.green);
            doc.rect(12, y + 1.5, 75, 0.8, 'F');
            y += 8;

            // Bar track
            doc.setFillColor(...C.ltgrey);
            doc.roundedRect(12, y, W - 24, 10, 3, 3, 'F');
            // Fill (red = used, green = remaining)
            if (timePct > 0) {
                const fillW = Math.max(6, (W - 24) * timePct);
                doc.setFillColor(...C.red);
                doc.roundedRect(12, y, fillW, 10, 3, 3, 'F');
            }
            // Labels inside bar
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(255, 255, 255);
            if (timePct > 0.15) doc.text(timeUsedMin + ' min used', 16, y + 6.8);
            doc.setTextColor(...C.grey);
            if (timeLeftMin > 0) {
                doc.text(timeLeftMin + ' min left', W - 14, y + 6.8, { align: 'right' });
            }
            y += 14;

            // Explanatory line
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(...C.grey);
            doc.text('Timer runs ONLY in the Games section. Home, AI Chatbot, Image Magic, Profile sections do NOT count.', 12, y);
            y += 5;
            doc.text('The limit resets every new day automatically. Parents can increase it from Settings.', 12, y);

            // ── Page 1 footer ──────────────────────────────────────
            doc.setFillColor(...C.dark);
            doc.rect(0, 283, W, 14, 'F');
            doc.setFillColor(...C.green);
            doc.rect(0, 283, W, 1.2, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(...C.green);
            doc.text('KidSpark', 10, 291);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...C.cream);
            doc.text('  Igniting Curiosity, Guiding Growth  |  (c) 2026 KidSpark Educational Series', 10 + doc.getTextWidth('KidSpark') + 2, 291);
            doc.setTextColor(...C.grey);
            doc.text('Page 1 / 2', W - 10, 291, { align: 'right' });

            // ════════════════════════════════════════════════════════
            //  PAGE 2 — Detailed breakdown (like Settings + Notes tab)
            // ════════════════════════════════════════════════════════
            doc.addPage();

            // ── Same dark header strip ─────────────────────────────
            doc.setFillColor(...C.dark);
            doc.rect(0, 0, W, 28, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.setTextColor(...C.green);
            doc.text('KidSpark', 10, 12);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(...C.cream);
            doc.text('Detailed Learning Report  —  ' + displayDate + '  ' + displayTime, 10, 20);
            doc.setFillColor(...C.green);
            doc.rect(0, 28, W, 1.2, 'F');

            let y2 = 36;

            // ── Helper: section heading (like app's tab headings) ──
            const sectionHead = (title, accentRGB) => {
                doc.setFillColor(...C.ltgrey);
                doc.rect(12, y2, W - 24, 9, 'F');
                doc.setFillColor(...accentRGB);
                doc.rect(12, y2, 4, 9, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.setTextColor(...C.dark);
                doc.text(title, 20, y2 + 6.2);
                y2 += 13;
            };

            // ── Helper: info row ───────────────────────────────────
            const row = (label, value, valueColor) => {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.setTextColor(...C.grey);
                doc.text(label, 16, y2);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                doc.setTextColor(...(valueColor || C.dark));
                doc.text(String(value), 90, y2);
                // Dotted line
                doc.setDrawColor(...C.sand);
                doc.setLineWidth(0.2);
                doc.setLineDashPattern([0.5, 1.5], 0);
                doc.line(16, y2 + 1, W - 16, y2 + 1);
                doc.setLineDashPattern([], 0);
                y2 += 8;
            };

            // Section 1: Child Profile
            sectionHead('CHILD PROFILE', C.green);
            row('Child Name', data.childName || 'Learner');
            row('Parent Email', data.email || '—');
            row('Current Level', level.level + ' - ' + level.name, C.plum);
            y2 += 3;

            // Section 2: Learning Progress
            sectionHead('LEARNING PROGRESS', C.gold);
            row('EXP Points', (s.exp || 0) + '   (+15 EXP earned for every game completed)');
            row('Stars Earned', (s.stars || 0) + '   (given for each correct answer)');
            row('Games Played', (s.gamesPlayed || 0) + '   (total number of games finished)');
            row('Login Streak', (s.loginStreak || 1) + ' days in a row');
            row('Total Login Days', (s.loginDays || 1) + ' days since account was created');
            row('Lives', (s.lives || 20) + ' / 20   (-1 per wrong answer, +1 every minute)');
            y2 += 3;

            // Section 3: Screen Time
            sectionHead('GAMES SCREEN TIME', C.red);
            row('Time Used Today', timeUsedMin + ' minutes   (only Games section counts)');
            row('Daily Time Limit', timeLimitMin + ' minutes   (set by parent, resets each day)');
            row('Time Remaining', timeLeftMin + ' minutes   left for today');
            row('Usage', Math.round(timePct * 100) + '%  of today\'s limit used');
            y2 += 3;

            // Section 4: What do these numbers mean?
            sectionHead('WHAT DO THESE NUMBERS MEAN?', C.plum);
            const explain = [
                ['EXP (Experience Points)', 'Earned by finishing games. More EXP = higher level. Shows how much your child plays.'],
                ['Stars', 'Earned for correct answers. Shows accuracy and understanding.'],
                ['Level', 'Goes up as EXP grows. Higher level = more games completed overall.'],
                ['Login Streak', 'Counts how many days in a row your child has logged in. Builds daily habits.'],
                ['Lives', 'Starts at 20. Decreases by 1 for each wrong answer. Refills +1 every minute automatically.'],
                ['Games Time', 'Only the time spent inside the Games section. AI, Chatbot & Images are NOT counted.'],
                ['Daily Limit', 'Maximum games time allowed per day. Resets to full every morning. Parent can change it.'],
            ];
            explain.forEach(([term, desc]) => {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(8.5);
                doc.setTextColor(...C.dark);
                doc.text(term + ':', 16, y2);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(...C.grey);
                const wrapped = doc.splitTextToSize(desc, W - 90);
                doc.text(wrapped, 72, y2);
                y2 += 5 + (wrapped.length - 1) * 4;
            });

            // ── Page 2 footer ──────────────────────────────────────
            doc.setFillColor(...C.dark);
            doc.rect(0, 283, W, 14, 'F');
            doc.setFillColor(...C.green);
            doc.rect(0, 283, W, 1.2, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(...C.green);
            doc.text('KidSpark', 10, 291);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...C.cream);
            doc.text('  Igniting Curiosity, Guiding Growth  |  (c) 2026 KidSpark Educational Series', 10 + doc.getTextWidth('KidSpark') + 2, 291);
            doc.setTextColor(...C.grey);
            doc.text('Page 2 / 2', W - 10, 291, { align: 'right' });

            // ── Save ───────────────────────────────────────────────
            doc.save(filename);
            KSApp.showToast('PDF downloaded: ' + filename, 'success');

        } catch (err) {
            console.error('PDF generation error:', err);
            KSApp.showToast('PDF error: ' + err.message, 'error');
        }
    },

    resetLock() {
        this.lock();
    }
};
