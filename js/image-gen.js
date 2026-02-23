/**
 * KidSpark Image Magic — Beautiful Animal Illustrations
 * Shows detailed, colorful animal illustrations with real fun facts
 * Works offline (no external image dependencies)
 * Each animal has a unique, detailed SVG illustration
 */

const ANIMAL_DB = [
    {
        name: 'Lion', emoji: '🦁',
        colors: { bg: '#FFF8E7', main: '#E8A040', dark: '#C17F2A', light: '#F5BF60', accent: '#2C2C2C' },
        fact: 'Lions are called the King of the Jungle! They can roar so loud it can be heard 8 km away! 🦁',
        habitat: '🌍 Africa — Savanna & Grasslands'
    },
    {
        name: 'Elephant', emoji: '🐘',
        colors: { bg: '#F0F4F8', main: '#8E9BAE', dark: '#5E6B7E', light: '#B0BCC8', accent: '#3A3c42' },
        fact: 'Elephants never forget! They have the biggest brains of all land animals. 🐘',
        habitat: '🌍 Africa & Asia — Forests & Savannas'
    },
    {
        name: 'Giraffe', emoji: '🦒',
        colors: { bg: '#FFFBF0', main: '#DAA520', dark: '#8B6914', light: '#F5DEB3', accent: '#3A3c42' },
        fact: 'Giraffes are the tallest animals on Earth! Their tongue is 45 cm long! 🦒',
        habitat: '🌍 Africa — Open Woodlands & Savannas'
    },
    {
        name: 'Tiger', emoji: '🐅',
        colors: { bg: '#FFF3E0', main: '#FF8C00', dark: '#CC5500', light: '#FFB347', accent: '#1A1A1A' },
        fact: 'Every tiger has a unique stripe pattern — just like our fingerprints! 🐅',
        habitat: '🌏 Asia — Jungles & Forests'
    },
    {
        name: 'Zebra', emoji: '🦓',
        colors: { bg: '#F8F8F8', main: '#2C2C2C', dark: '#111111', light: '#EEEEEE', accent: '#333333' },
        fact: 'No two zebras have the same stripe pattern! They are all unique! 🦓',
        habitat: '🌍 Africa — Grasslands & Savannas'
    },
    {
        name: 'Parrot', emoji: '🦜',
        colors: { bg: '#E8FFE8', main: '#22BB44', dark: '#115522', light: '#66CC44', accent: '#FF4400' },
        fact: 'Parrots can learn to talk and even sing songs! Smart birds! 🦜',
        habitat: '🌎 Tropical Rainforests Worldwide'
    },
    {
        name: 'Rabbit', emoji: '🐰',
        colors: { bg: '#FFF0F5', main: '#E8B4C8', dark: '#C0748A', light: '#F5D4E0', accent: '#FF6699' },
        fact: 'Rabbits can jump very high and run very fast. They love carrots! 🥕🐰',
        habitat: '🌿 Meadows, Forests & Grasslands'
    },
    {
        name: 'Dolphin', emoji: '🐬',
        colors: { bg: '#E0F7FA', main: '#0097A7', dark: '#006064', light: '#4DD0E1', accent: '#1A237E' },
        fact: 'Dolphins are very smart! They communicate using special sounds! 🐬',
        habitat: '🌊 Oceans & Seas Worldwide'
    },
    {
        name: 'Penguin', emoji: '🐧',
        colors: { bg: '#E3F2FD', main: '#212121', dark: '#000000', light: '#FFFFFF', accent: '#FF6600' },
        fact: 'Penguins cannot fly, but they are amazing swimmers! 🐧',
        habitat: '🧊 Antarctica & Southern Hemisphere'
    },
    {
        name: 'Peacock', emoji: '🦚',
        colors: { bg: '#E8F5E9', main: '#1A73E8', dark: '#0D47A1', light: '#42A5F5', accent: '#00E676' },
        fact: "The peacock is India's national bird! Its tail feathers are called a train! 🦚",
        habitat: '🌏 South Asia — Forests & Farmlands'
    },
    {
        name: 'Cow', emoji: '🐄',
        colors: { bg: '#FAFAFA', main: '#D4A373', dark: '#8B5E3C', light: '#F5E6D3', accent: '#2C2C2C' },
        fact: 'A cow gives us milk to make butter, cheese and ice cream! 🥛🐄',
        habitat: '🌿 Farms & Grasslands'
    },
    {
        name: 'Dog', emoji: '🐕',
        colors: { bg: '#FFF8F0', main: '#C68642', dark: '#8B5E3C', light: '#E8C49C', accent: '#3A3c42' },
        fact: "Dogs are called man's best friend! They have a super sense of smell! 🐕",
        habitat: '🏠 Domestic — Lives with humans'
    },
    {
        name: 'Cat', emoji: '🐱',
        colors: { bg: '#F5F5F5', main: '#B0B0B0', dark: '#707070', light: '#E0E0E0', accent: '#FF6B9D' },
        fact: 'Cats can sleep 12–16 hours a day! They are expert nappers 😴🐱',
        habitat: '🏠 Domestic — Lives with humans'
    },
    {
        name: 'Butterfly', emoji: '🦋',
        colors: { bg: '#F3E5F5', main: '#9C27B0', dark: '#6A1B9A', light: '#CE93D8', accent: '#FF9800' },
        fact: 'Butterflies taste with their feet! They start life as caterpillars! 🦋',
        habitat: '🌸 Gardens & Flower Meadows'
    },
    {
        name: 'Fish', emoji: '🐟',
        colors: { bg: '#E0F2F1', main: '#26A69A', dark: '#00796B', light: '#80CBC4', accent: '#FF8F00' },
        fact: 'Fish breathe underwater through their gills. There are 30,000+ types! 🐟',
        habitat: '🌊 Rivers, Lakes & Oceans'
    },
    {
        name: 'Horse', emoji: '🐴',
        colors: { bg: '#FBE9E7', main: '#8B572A', dark: '#5D3A1A', light: '#C49A6C', accent: '#F5F5DC' },
        fact: 'Horses can sleep standing up! They are very strong and fast! 🐴',
        habitat: '🌿 Farms, Meadows & Plains'
    },
    {
        name: 'Monkey', emoji: '🐒',
        colors: { bg: '#FFF9C4', main: '#C8A96E', dark: '#8B6914', light: '#E8D5A3', accent: '#FF7043' },
        fact: 'Monkeys are very clever! They use tools and live in big groups! 🐒',
        habitat: '🌴 Tropical Forests & Jungles'
    },
    {
        name: 'Duck', emoji: '🦆',
        colors: { bg: '#E8F5E9', main: '#558B2F', dark: '#33691E', light: '#AED581', accent: '#FDD835' },
        fact: 'Ducks have waterproof feathers! Baby ducks are called ducklings! 🦆',
        habitat: '🏞️ Ponds, Lakes & Wetlands'
    },
    {
        name: 'Deer', emoji: '🦌',
        colors: { bg: '#FFF8E1', main: '#A0785A', dark: '#6D4C41', light: '#D7B899', accent: '#2E7D32' },
        fact: 'Deer can run very fast and jump over high fences! Males have antlers! 🦌',
        habitat: '🌲 Forests & Woodlands'
    },
    {
        name: 'Frog', emoji: '🐸',
        colors: { bg: '#E8F5E9', main: '#4CAF50', dark: '#2E7D32', light: '#A5D6A7', accent: '#FDD835' },
        fact: 'Frogs can jump 20 times their own body length! They start as tadpoles! 🐸',
        habitat: '🌿 Ponds, Swamps & Rainforests'
    },
];

// ─── Animal SVG Illustration Generator ───────────────────────────────────────
// Creates detailed, unique SVG illustrations for each animal

function generateAnimalSVG(animal) {
    const c = animal.colors;
    const name = animal.name;

    // Unique illustrations for specific animals
    const specific = {
        Lion: () => `
            <defs>
                <radialGradient id="bg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${c.bg}"/><stop offset="100%" stop-color="${c.light}44"/></radialGradient>
                <radialGradient id="body" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="${c.light}"/><stop offset="100%" stop-color="${c.main}"/></radialGradient>
            </defs>
            <rect width="400" height="400" fill="url(#bg)" rx="24"/>
            <!-- Grass -->
            <ellipse cx="200" cy="385" rx="160" ry="20" fill="#9ccD6222"/>
            <!-- Mane (big circle behind head) -->
            <circle cx="200" cy="178" r="95" fill="${c.dark}"/>
            <circle cx="200" cy="175" r="82" fill="${c.main}"/>
            <!-- Body -->
            <ellipse cx="200" cy="305" rx="90" ry="75" fill="${c.main}"/>
            <!-- Head -->
            <circle cx="200" cy="168" r="68" fill="${c.light}"/>
            <!-- Ears -->
            <circle cx="148" cy="112" r="24" fill="${c.main}"/><circle cx="148" cy="112" r="14" fill="${c.dark}"/>
            <circle cx="252" cy="112" r="24" fill="${c.main}"/><circle cx="252" cy="112" r="14" fill="${c.dark}"/>
            <!-- Eyes -->
            <circle cx="176" cy="162" r="16" fill="white"/><circle cx="224" cy="162" r="16" fill="white"/>
            <circle cx="179" cy="165" r="10" fill="${c.dark}88"/><circle cx="227" cy="165" r="10" fill="${c.dark}88"/>
            <circle cx="181" cy="162" r="4" fill="black"/><circle cx="229" cy="162" r="4" fill="black"/>
            <circle cx="184" cy="160" r="3" fill="white"/><circle cx="232" cy="160" r="3" fill="white"/>
            <!-- Nose -->
            <ellipse cx="200" cy="190" rx="14" ry="10" fill="${c.dark}"/>
            <ellipse cx="197" cy="187" rx="5" ry="3" fill="rgba(255,255,255,0.4)"/>
            <!-- Mouth -->
            <path d="M185 200 Q200 215 215 200" stroke="${c.dark}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <!-- Whiskers -->
            <line x1="115" y1="183" x2="175" y2="190" stroke="${c.dark}" stroke-width="1.5" opacity="0.5"/>
            <line x1="115" y1="193" x2="175" y2="197" stroke="${c.dark}" stroke-width="1.5" opacity="0.5"/>
            <line x1="225" y1="190" x2="285" y2="183" stroke="${c.dark}" stroke-width="1.5" opacity="0.5"/>
            <line x1="225" y1="197" x2="285" y2="193" stroke="${c.dark}" stroke-width="1.5" opacity="0.5"/>
            <!-- Cheeks -->
            <circle cx="157" cy="185" r="18" fill="#FF886644" opacity="0.5"/>
            <circle cx="243" cy="185" r="18" fill="#FF886644" opacity="0.5"/>
            <!-- Legs -->
            <rect x="145" y="355" width="30" height="42" rx="14" fill="${c.main}"/>
            <rect x="185" y="355" width="30" height="42" rx="14" fill="${c.main}"/>
            <rect x="225" y="355" width="30" height="42" rx="14" fill="${c.main}"/>
            <!-- Tail -->
            <path d="M288 285 Q345 230 318 175" stroke="${c.main}" stroke-width="13" fill="none" stroke-linecap="round"/>
            <circle cx="316" cy="171" r="16" fill="${c.dark}"/>
            <!-- Crown sparkle -->
            <text x="320" y="65" font-size="28" opacity="0.85">👑</text>
            <text x="50" y="75" font-size="22" opacity="0.7">✨</text>
        `,

        Elephant: () => `
            <defs>
                <radialGradient id="bg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${c.bg}"/><stop offset="100%" stop-color="${c.light}33"/></radialGradient>
            </defs>
            <rect width="400" height="400" fill="url(#bg)" rx="24"/>
            <!-- Body -->
            <ellipse cx="210" cy="295" rx="110" ry="90" fill="${c.main}"/>
            <!-- Head -->
            <circle cx="195" cy="168" r="82" fill="${c.main}"/>
            <!-- Big ears -->
            <ellipse cx="108" cy="172" rx="52" ry="68" fill="${c.light}"/>
            <ellipse cx="108" cy="172" rx="36" ry="50" fill="${c.main}AA"/>
            <ellipse cx="292" cy="172" rx="52" ry="68" fill="${c.light}"/>
            <ellipse cx="292" cy="172" rx="36" ry="50" fill="${c.main}AA"/>
            <!-- Head over ears -->
            <circle cx="195" cy="168" r="74" fill="${c.main}"/>
            <!-- Trunk -->
            <path d="M200 220 Q170 268 182 315 Q184 325 192 318 Q200 310 200 300 Q200 275 215 260 Q225 250 215 235 Q208 228 200 220" fill="${c.main}" stroke="${c.dark}33" stroke-width="1"/>
            <circle cx="192" cy="316" r="10" fill="${c.dark}77"/>
            <!-- Eyes -->
            <circle cx="172" cy="152" r="15" fill="white"/><circle cx="218" cy="152" r="15" fill="white"/>
            <circle cx="175" cy="155" r="9" fill="${c.dark}"/><circle cx="221" cy="155" r="9" fill="${c.dark}"/>
            <circle cx="177" cy="153" r="3" fill="white"/><circle cx="223" cy="153" r="3" fill="white"/>
            <!-- Tusks -->
            <path d="M175 210 Q148 240 138 265" stroke="#F5F5DC" stroke-width="8" fill="none" stroke-linecap="round"/>
            <path d="M215 212 Q240 240 250 265" stroke="#F5F5DC" stroke-width="8" fill="none" stroke-linecap="round"/>
            <!-- Legs -->
            <rect x="128" y="362" width="40" height="38" rx="16" fill="${c.dark}"/>
            <rect x="178" y="362" width="40" height="38" rx="16" fill="${c.dark}"/>
            <rect x="228" y="362" width="40" height="38" rx="16" fill="${c.dark}"/>
            <!-- Tail -->
            <path d="M318 285 Q350 255 338 225" stroke="${c.dark}" stroke-width="7" fill="none" stroke-linecap="round"/>
            <text x="60" y="72" font-size="22" opacity="0.7">✨</text>
            <text x="310" y="68" font-size="18" opacity="0.6">🌍</text>
        `,

        Giraffe: () => `
            <defs>
                <radialGradient id="bg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${c.bg}"/><stop offset="100%" stop-color="${c.light}44"/></radialGradient>
            </defs>
            <rect width="400" height="400" fill="url(#bg)" rx="24"/>
            <!-- Neck -->
            <rect x="168" y="85" width="64" height="195" rx="28" fill="${c.main}"/>
            <!-- Body -->
            <ellipse cx="200" cy="320" rx="88" ry="65" fill="${c.main}"/>
            <!-- Head -->
            <ellipse cx="200" cy="72" rx="46" ry="42" fill="${c.light}"/>
            <!-- Horns (ossicones) -->
            <rect x="180" y="32" width="10" height="28" rx="5" fill="${c.dark}"/><circle cx="185" cy="31" r="7" fill="${c.dark}"/>
            <rect x="210" y="32" width="10" height="28" rx="5" fill="${c.dark}"/><circle cx="215" cy="31" r="7" fill="${c.dark}"/>
            <!-- Spots on neck and body -->
            <ellipse cx="183" cy="130" rx="14" ry="20" fill="${c.dark}55"/>
            <ellipse cx="217" cy="160" rx="12" ry="18" fill="${c.dark}55"/>
            <ellipse cx="183" cy="195" rx="16" ry="22" fill="${c.dark}55"/>
            <ellipse cx="217" cy="225" rx="13" ry="19" fill="${c.dark}55"/>
            <ellipse cx="148" cy="300" rx="22" ry="28" fill="${c.dark}44"/>
            <ellipse cx="248" cy="295" rx="20" ry="25" fill="${c.dark}44"/>
            <ellipse cx="196" cy="330" rx="18" ry="22" fill="${c.dark}44"/>
            <!-- Eyes -->
            <circle cx="184" cy="68" r="12" fill="white"/><circle cx="216" cy="68" r="12" fill="white"/>
            <circle cx="187" cy="70" r="7" fill="${c.accent}"/><circle cx="219" cy="70" r="7" fill="${c.accent}"/>
            <circle cx="188" cy="68" r="2.5" fill="white"/><circle cx="220" cy="68" r="2.5" fill="white"/>
            <!-- Nose -->
            <ellipse cx="200" cy="92" rx="11" ry="8" fill="${c.dark}"/>
            <!-- Muzzle -->
            <ellipse cx="200" cy="88" rx="22" ry="15" fill="${c.light}DD"/>
            <ellipse cx="200" cy="92" rx="11" ry="8" fill="${c.dark}"/>
            <!-- Legs -->
            <rect x="130" y="368" width="24" height="32" rx="10" fill="${c.dark}"/>
            <rect x="162" y="368" width="24" height="32" rx="10" fill="${c.dark}"/>
            <rect x="214" y="368" width="24" height="32" rx="10" fill="${c.dark}"/>
            <rect x="246" y="368" width="24" height="32" rx="10" fill="${c.dark}"/>
            <text x="52" y="72" font-size="22" opacity="0.7">🌳</text>
            <text x="312" y="68" font-size="20" opacity="0.6">✨</text>
        `,

        Tiger: () => `
            <defs>
                <radialGradient id="bg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${c.bg}"/><stop offset="100%" stop-color="${c.main}22"/></radialGradient>
            </defs>
            <rect width="400" height="400" fill="url(#bg)" rx="24"/>
            <!-- Body -->
            <ellipse cx="200" cy="290" rx="100" ry="80" fill="${c.main}"/>
            <!-- Stripes on body -->
            <path d="M135 258 Q115 280 130 300" stroke="${c.dark}" stroke-width="9" fill="none" opacity="0.6" stroke-linecap="round"/>
            <path d="M145 230 Q122 248 138 270" stroke="${c.dark}" stroke-width="9" fill="none" opacity="0.6" stroke-linecap="round"/>
            <path d="M255 258 Q275 280 260 300" stroke="${c.dark}" stroke-width="9" fill="none" opacity="0.6" stroke-linecap="round"/>
            <path d="M248 230 Q268 248 252 270" stroke="${c.dark}" stroke-width="9" fill="none" opacity="0.6" stroke-linecap="round"/>
            <!-- Head -->
            <circle cx="200" cy="162" r="80" fill="${c.main}"/>
            <!-- White face patches -->
            <ellipse cx="178" cy="188" rx="30" ry="22" fill="${c.light}CC"/>
            <ellipse cx="222" cy="188" rx="30" ry="22" fill="${c.light}CC"/>
            <ellipse cx="200" cy="165" rx="42" ry="55" fill="${c.light}55"/>
            <!-- Ears -->
            <polygon points="142,98 120,52 165,72" fill="${c.main}"/><polygon points="142,98 128,62 160,75" fill="${c.dark}"/>
            <polygon points="258,98 280,52 235,72" fill="${c.main}"/><polygon points="258,98 272,62 240,75" fill="${c.dark}"/>
            <!-- Stripes on head -->
            <path d="M160 108 Q155 128 152 148" stroke="${c.dark}" stroke-width="6" fill="none" opacity="0.65" stroke-linecap="round"/>
            <path d="M175 98 Q172 118 170 140" stroke="${c.dark}" stroke-width="5" fill="none" opacity="0.55" stroke-linecap="round"/>
            <path d="M240 108 Q245 128 248 148" stroke="${c.dark}" stroke-width="6" fill="none" opacity="0.65" stroke-linecap="round"/>
            <path d="M225 98 Q228 118 230 140" stroke="${c.dark}" stroke-width="5" fill="none" opacity="0.55" stroke-linecap="round"/>
            <!-- Eyes -->
            <circle cx="175" cy="152" r="17" fill="white"/><circle cx="225" cy="152" r="17" fill="white"/>
            <circle cx="178" cy="155" r="11" fill="#4CAF50"/><circle cx="228" cy="155" r="11" fill="#4CAF50"/>
            <circle cx="179" cy="153" r="5" fill="black"/><circle cx="229" cy="153" r="5" fill="black"/>
            <circle cx="182" cy="151" r="3" fill="white"/><circle cx="232" cy="151" r="3" fill="white"/>
            <!-- Nose -->
            <ellipse cx="200" cy="182" rx="12" ry="8" fill="${c.dark}"/>
            <!-- Mouth -->
            <path d="M186 192 Q200 205 214 192" stroke="${c.dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
            <!-- Whiskers -->
            <line x1="108" y1="178" x2="172" y2="186" stroke="white" stroke-width="1.5" opacity="0.8"/>
            <line x1="108" y1="188" x2="172" y2="192" stroke="white" stroke-width="1.5" opacity="0.8"/>
            <line x1="228" y1="186" x2="292" y2="178" stroke="white" stroke-width="1.5" opacity="0.8"/>
            <line x1="228" y1="192" x2="292" y2="188" stroke="white" stroke-width="1.5" opacity="0.8"/>
            <!-- Legs -->
            <rect x="135" y="352" width="32" height="48" rx="14" fill="${c.dark}"/>
            <rect x="178" y="352" width="32" height="48" rx="14" fill="${c.dark}"/>
            <rect x="222" y="352" width="32" height="48" rx="14" fill="${c.dark}"/>
            <text x="50" y="72" font-size="24" opacity="0.8">🌿</text>
            <text x="315" y="68" font-size="20" opacity="0.7">✨</text>
        `,
    };

    if (specific[name]) return specific[name]();

    // ─── Universal detailed illustration for all other animals ───
    const { bg, main, dark, light, accent } = c;
    return `
        <defs>
            <radialGradient id="bg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${bg}"/><stop offset="100%" stop-color="${main}22"/></radialGradient>
            <radialGradient id="body-g" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="${light}"/><stop offset="100%" stop-color="${main}"/></radialGradient>
        </defs>
        <rect width="400" height="400" fill="url(#bg)" rx="24"/>
        <!-- Shadow -->
        <ellipse cx="200" cy="375" rx="145" ry="18" fill="${main}22"/>
        <!-- Body -->
        <ellipse cx="200" cy="285" rx="95" ry="78" fill="url(#body-g)"/>
        <!-- Head -->
        <circle cx="200" cy="162" r="72" fill="url(#body-g)"/>
        <!-- Ears -->
        <ellipse cx="148" cy="102" rx="26" ry="36" fill="${main}" transform="rotate(-15,148,102)"/>
        <ellipse cx="252" cy="102" rx="26" ry="36" fill="${main}" transform="rotate(15,252,102)"/>
        <ellipse cx="148" cy="101" rx="14" ry="22" fill="${light}77" transform="rotate(-15,148,102)"/>
        <ellipse cx="252" cy="101" rx="14" ry="22" fill="${light}77" transform="rotate(15,252,102)"/>
        <!-- Eyes -->
        <circle cx="176" cy="152" r="17" fill="white"/>
        <circle cx="224" cy="152" r="17" fill="white"/>
        <circle cx="180" cy="156" r="11" fill="${accent == '#3A3c42' ? '#5B4A3A' : accent}"/>
        <circle cx="228" cy="156" r="11" fill="${accent == '#3A3c42' ? '#5B4A3A' : accent}"/>
        <circle cx="179" cy="153" r="5" fill="black"/>
        <circle cx="227" cy="153" r="5" fill="black"/>
        <circle cx="182" cy="151" r="3" fill="white"/>
        <circle cx="230" cy="151" r="3" fill="white"/>
        <!-- Nose -->
        <ellipse cx="200" cy="182" rx="14" ry="10" fill="${dark}"/>
        <ellipse cx="197" cy="179" rx="5" ry="3.5" fill="rgba(255,255,255,0.4)"/>
        <!-- Mouth -->
        <path d="M186 192 Q200 207 214 192" stroke="${dark}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <!-- Cheeks -->
        <circle cx="153" cy="176" r="19" fill="#FF886655" opacity="0.6"/>
        <circle cx="247" cy="176" r="19" fill="#FF886655" opacity="0.6"/>
        <!-- Body markings / pattern -->
        <ellipse cx="185" cy="268" rx="22" ry="28" fill="${dark}22"/>
        <ellipse cx="215" cy="295" rx="18" ry="22" fill="${dark}22"/>
        <!-- Legs -->
        <rect x="140" y="348" width="32" height="52" rx="14" fill="${main}"/>
        <rect x="183" y="348" width="32" height="52" rx="14" fill="${main}"/>
        <rect x="226" y="348" width="32" height="52" rx="14" fill="${main}"/>
        <!-- Tail -->
        <path d="M293 270 Q348 218 322 162" stroke="${main}" stroke-width="14" fill="none" stroke-linecap="round"/>
        <circle cx="320" cy="158" r="13" fill="${dark}"/>
        <!-- Sparkles -->
        <text x="52" y="76" font-size="22" opacity="0.75">✨</text>
        <text x="315" y="68" font-size="18" opacity="0.65">⭐</text>
    `;
}

// ─── Main ImageGen Controller ─────────────────────────────────────────────────

const KSImageGen = {
    init() {
        this.renderAnimalGrid();
        this.bindClose();
    },

    renderAnimalGrid() {
        const grid = document.getElementById('animal-grid');
        if (!grid) return;
        grid.innerHTML = '';
        ANIMAL_DB.forEach(animal => {
            const chip = document.createElement('div');
            chip.className = 'animal-chip';
            chip.id = `animal-chip-${animal.name.toLowerCase()}`;
            chip.innerHTML = `<span class="animal-emoji">${animal.emoji}</span><span class="animal-name">${animal.name}</span>`;
            chip.addEventListener('click', () => this.showAnimal(animal));
            grid.appendChild(chip);
        });
    },

    showAnimal(animal) {
        const display = document.getElementById('image-display');
        const nameEl = document.getElementById('image-animal-name');
        const loading = document.getElementById('image-loading');
        const canvasEl = document.getElementById('image-canvas');
        const factEl = document.getElementById('image-fun-fact');
        if (!display) return;

        nameEl.textContent = `${animal.emoji} ${animal.name}`;
        factEl.innerHTML = `<div class="animal-fact-row">
            <span class="fact-icon">💡</span>
            <div>
                <strong>${animal.fact}</strong><br>
                <span class="animal-habitat">${animal.habitat || ''}</span>
            </div>
        </div>`;

        loading.classList.remove('hidden');
        display.classList.remove('hidden');

        // Remove any existing big emoji from previous click
        const oldEmoji = canvasEl.querySelector('.animal-big-emoji');
        if (oldEmoji) oldEmoji.remove();

        setTimeout(() => {
            loading.classList.add('hidden');

            // Show the SAME emoji from the card — big and bouncy!
            const bigEmoji = document.createElement('div');
            bigEmoji.className = 'animal-big-emoji';
            bigEmoji.textContent = animal.emoji;
            bigEmoji.style.cssText = `
                font-size: 9rem;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                line-height: 1;
                filter: drop-shadow(0 8px 24px rgba(0,0,0,0.18));
                animation: pop 0.55s cubic-bezier(0.34,1.56,0.64,1);
                cursor: default;
                user-select: none;
            `;
            canvasEl.appendChild(bigEmoji);
        }, 600);
    },

    bindClose() {
        const close = document.getElementById('close-image');
        if (close) close.addEventListener('click', () => {
            const display = document.getElementById('image-display');
            if (display) display.classList.add('hidden');
            // Remove big emoji
            const canvas = document.getElementById('image-canvas');
            const emoji = canvas?.querySelector('.animal-big-emoji');
            if (emoji) emoji.remove();
        });
    }
};
