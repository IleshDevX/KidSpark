/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║         KidSpark — Chapter Video Links                  ║
 * ║  ✏️  EDIT THIS FILE to set the right YouTube links      ║
 * ║                                                          ║
 * ║  For each chapter put EITHER:                            ║
 * ║   • A full YouTube URL  → "https://youtu.be/xxxx"       ║
 * ║   • A YouTube video ID  → "xxxx"  (from the URL)        ║
 * ║                                                          ║
 * ║  How to get a YouTube video ID:                          ║
 * ║  https://youtube.com/watch?v=DR-cfDsHuUA                 ║
 * ║                              ^^^^^^^^^^^^^^^^            ║
 * ║  That last part is the ID  ──────────────────┘           ║
 * ╚══════════════════════════════════════════════════════════╝
 */

// ─── 📖 ENGLISH: Unit Videos ────────────────────────────────────────────────
// One video per Unit — replace the videoUrl with the correct link

const VIDEO_LINKS_ENGLISH = {

    'Unit 1': {
        label: '🧍 Me and My Body',
        videoUrl: 'https://youtu.be/1AM7KuFi2mo?si=U_YAzplyFhguM-ZQ&t=3'     // ← REPLACE with your link
    },

    'Unit 2': {
        label: '👨‍👩‍👧 My Family',
        videoUrl: 'https://youtu.be/mvv_5PU00e0?si=ZDoMwvnja_JefyJ6&t=8s'     // ← REPLACE with your link
    },

    'Unit 3': {
        label: '🐄 Animals Around Me',
        videoUrl: 'https://youtu.be/2sn9HLpzx9E?si=WJ865dbB8GJnv6FC'     // ← REPLACE with your link
    },

    'Unit 4': {
        label: '🍎 Food We Eat',
        videoUrl: 'https://youtu.be/uzNj2fz3fKQ?si=4TJsfl5yt9D6ipIe&t=10s'     // ← REPLACE with your link
    },

    'Unit 5': {
        label: '🌦️ Seasons and Weather',
        videoUrl: 'https://youtu.be/LBlzDpAixEs?si=MHuSB4gVkNLw23UU&t=5s'     // ← REPLACE with your link
    },

    'Unit 6': {
        label: '🚌 Transport and Travel',
        videoUrl: 'https://youtu.be/BZf6frPNrhg?si=Gc6NHl-t5VwBqm7x&t=7'     // ← REPLACE with your link
    },

    'Unit 7': {
        label: '🔤 Alphabet & Letters',
        videoUrl: 'https://youtu.be/C7oebqj3PCY?si=8j32JdyeHo9GfcNh&t=7'     // ← REPLACE with your link
    },

    'Unit 8': {
        label: '🎵 Rhymes and Stories',
        videoUrl: 'https://youtu.be/hcOdWqzo_qQ?si=SAy21QyvYfsQVoKS'     // ← REPLACE with your link
    },

    'Unit 9': {
        label: '✅ Good Habits',
        videoUrl: 'https://youtu.be/bN36nh-2tuI?si=t1cdqO1FnuRpc2_c'     // ← REPLACE with your link
    },
};

// ─── 🔢 MATHS: Chapter Videos ───────────────────────────────────────────────
// One video per Chapter — replace the videoUrl with the correct link

const VIDEO_LINKS_MATHS = {

    'Chapter 1': {
        label: '📍 Position Words',
        videoUrl: 'https://youtu.be/_VK-kXkXTBc?si=1a7zgAu3B0pFPr1-'     // ← REPLACE with your link
    },

    'Chapter 2': {
        label: '🔷 Shapes',
        videoUrl: 'https://youtu.be/jlzX8jt0Now?si=a9OXgkOMkfSyWGG9'     // ← REPLACE with your link
    },

    'Chapter 3': {
        label: '🔢 Numbers 1 to 9',
        videoUrl: 'https://youtu.be/K1CzqkbGI2w?si=BNHg_nodnmGTZ5If'     // ← REPLACE with your link
    },

    'Chapter 4': {
        label: '🔢 Numbers 10 to 20',
        videoUrl: 'https://youtu.be/U2evJySE4wM?si=EBH_tqLWv1DbYBtg'     // ← REPLACE with your link
    },

    'Chapter 5': {
        label: '➕ Addition',
        videoUrl: 'https://youtu.be/VScM8Z8Jls0?si=L4_aSkDdokXcz6RM'     // ← REPLACE with your link
    },

    'Chapter 6': {
        label: '➖ Subtraction',
        videoUrl: 'https://youtu.be/YLPbduEc4sA?si=UdrTddE9Ek-tYXDt'     // ← REPLACE with your link
    },

    'Chapter 7': {
        label: '⚖️ Heavy and Light',
        videoUrl: 'https://youtu.be/qUOQrXmfwDM?si=qO-EF73zaYi7q7Iq'     // ← REPLACE with your link
    },

    'Chapter 8': {
        label: '🔢 Big Numbers 21–99',
        videoUrl: 'https://youtu.be/0ZhwYYZS9bE?si=kNhb4GW5qqC6zFQR'     // ← REPLACE with your link
    },

    'Chapter 9': {
        label: '🔟 Counting in 5s & 10s',
        videoUrl: 'https://youtu.be/EemjeA2Djjw?si=0VkPoIbuqOwU3ce-'     // ← REPLACE with your link
    },
};

// ─── Fallback video (shown if chapter has no match) ──────────────────────────
const VIDEO_LINKS_DEFAULT = {
    label: '📺 Grade 1 Learning',
    videoUrl: 'https://youtu.be/852gD9dpVqk?si=wcVer_T2TBMsw3Ib'         // ← REPLACE with your fallback link
};

// ─────────────────────────────────────────────────────────────────────────────
// 🔧 HELPER — Extracts a bare YouTube video ID from any URL format
//    Handles: https://youtu.be/ID, https://youtube.com/watch?v=ID, bare IDs
// ─────────────────────────────────────────────────────────────────────────────
function extractYouTubeId(url) {
    if (!url) return '';
    // Already a bare ID (no slashes/dots)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
    try {
        const u = new URL(url);
        // youtu.be/ID short links
        if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0];
        // youtube.com/watch?v=ID
        if (u.searchParams.get('v')) return u.searchParams.get('v');
        // youtube.com/embed/ID
        const em = u.pathname.match(/embed\/([a-zA-Z0-9_-]{11})/);
        if (em) return em[1];
    } catch (_) { }
    // Fallback regex
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : '';
}

// ─────────────────────────────────────────────────────────────────────────────
// 📦 Merged export — builds CHAPTER_VIDEOS that chatbot.js uses
//    Combines English + Maths + default into one lookup object
// ─────────────────────────────────────────────────────────────────────────────
const CHAPTER_VIDEOS = (() => {
    const merged = {};

    const buildEntry = (unit, info) => ({
        title: `${unit} – ${info.label.replace(/^[^ ]+ /, '')}`,
        videoId: extractYouTubeId(info.videoUrl),
        label: info.label
    });

    Object.entries(VIDEO_LINKS_ENGLISH).forEach(([unit, info]) => {
        merged[unit] = buildEntry(unit, info);
    });

    Object.entries(VIDEO_LINKS_MATHS).forEach(([unit, info]) => {
        merged[unit] = buildEntry(unit, info);
    });

    merged['default'] = {
        title: VIDEO_LINKS_DEFAULT.label,
        videoId: extractYouTubeId(VIDEO_LINKS_DEFAULT.videoUrl),
        label: VIDEO_LINKS_DEFAULT.label
    };

    return merged;
})();
