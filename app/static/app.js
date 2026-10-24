// Thirukural Explainer — Frontend Controller (Slice 2)

let currentLanguage = sessionStorage.getItem('thirukural_lang') || 'en';
let currentKural = null;

// UI Translations Dictionary
const I18N = {
    en: {
        appTitle: "Thirukural Explainer",
        appSubtitle: "Timeless Wisdom · Oil-Paint Edition",
        heroTag: "Classical Tamil Heritage",
        heroTitle: "Universal Wisdom in Couplets",
        heroSub: "Explore 1,330 verses on virtue, wealth, and love through historical G.U. Pope translations and modern AI storytelling.",
        searchPlaceholder: "Search by number (1-1330), words (e.g., 'அகர'), or chapter ('adhigaram 5')...",
        searchBtn: "Search",
        quickPicks: "Quick Picks:",
        kuralLabel: "Sacred Couplet",
        popeHeading: "G.U. Pope Translation (1886)",
        taHeading: "Tamil Commentary",
        storyHeading: "AI Short-Story Illustration",
        storyPlaceholder: "Select 'Read Story' to generate a contextual real-world narrative for this verse.",
        readStoryBtn: "Generate AI Story",
        prevBtn: "← Previous",
        nextBtn: "Next Kural →",
        backSearch: "🔍 Home & Search",
        noMatchTitle: "No exact verse found",
        exploreFamous: "Explore these celebrated kurals instead:"
    },
    ta: {
        appTitle: "திருக்குறள் விளக்கம்",
        appSubtitle: "காலத்தால் அழியாத தமிழ் அறம்",
        heroTag: "செம்மொழித் தமிழ் மரபு",
        heroTitle: "வையத்து வாழ்வாங்கு வாழும் நெறி",
        heroSub: "அறத்துப்பால், பொருட்பால், காமத்துப்பால் என்னும் முப்பாலின் 1330 அருங்குறள்களை வரலாற்று மொழிபெயர்ப்போடும் சிறுகதை விளக்கத்தோடும் உணருங்கள்.",
        searchPlaceholder: "குறள் எண் (1-1330), சொல் (எ.கா: 'அகர'), அல்லது அதிகாரம் (எ.கா: 'adhigaram 5')...",
        searchBtn: "தேடுக",
        quickPicks: "முக்கிய குறள்கள்:",
        kuralLabel: "அருங்குறள்",
        popeHeading: "ஜி.யு. போப் ஆங்கில மொழிபெயர்ப்பு (1886)",
        taHeading: "தமிழ் உரை விளக்கம்",
        storyHeading: "செயற்கை நுண்ணறிவு சிறுகதை விளக்கம்",
        storyPlaceholder: "இக்குறளின் வாழ்வியல் கருத்தை விளக்கும் சிறுகதையைப் படிக்க கீழே உள்ள பொத்தானை அழுத்தவும்.",
        readStoryBtn: "கதை விளக்கம் பெறுக",
        prevBtn: "← முந்தைய குறள்",
        nextBtn: "அடுத்த குறள் →",
        backSearch: "🔍 முகப்பு / தேடல்",
        noMatchTitle: "குறள் எதுவும் கிடைக்கவில்லை",
        exploreFamous: "புகழ்பெற்ற இந்த அருங்குறள்களைக் காண்க:"
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    updateLanguageUI();
    
    // Check if URL has a specific kural hash, e.g., #1 or #391
    const hash = window.location.hash.replace('#', '');
    if (hash && !isNaN(hash)) {
        loadKuralByNumber(parseInt(hash));
    } else {
        loadKuralByNumber(1);
    }

    // Bind Enter key in search box
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeSearch();
        });
    }
});

function setLanguage(lang) {
    currentLanguage = lang;
    sessionStorage.setItem('thirukural_lang', lang);
    updateLanguageUI();
    if (currentKural) {
        renderVerse(currentKural);
    }
}

function updateLanguageUI() {
    const t = I18N[currentLanguage];
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
    });

    // Update static labels if elements exist
    setElementText('uiAppTitle', t.appTitle);
    setElementText('uiAppSubtitle', t.appSubtitle);
    setElementText('uiHeroTag', t.heroTag);
    setElementText('uiHeroTitle', t.heroTitle);
    setElementText('uiHeroSub', t.heroSub);
    setElementText('uiQuickLabel', t.quickPicks);
    setElementText('uiSearchBtn', t.searchBtn);
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;
}

function setElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// Fetch and render a specific kural by number
async function loadKuralByNumber(number) {
    if (number < 1) number = 1330;
    if (number > 1330) number = 1;

    try {
        const res = await fetch(`/api/kural/${number}`);
        if (!res.ok) throw new Error("Kural not found");
        const kural = await res.json();
        currentKural = kural;
        window.location.hash = `#${number}`;
        renderVerse(kural);
    } catch (err) {
        console.error("Error loading kural:", err);
    }
}

// Multi-mode search execution
async function executeSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    try {
        const res = await fetch(`/api/kural/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (data.found && data.kural) {
            currentKural = data.kural;
            window.location.hash = `#${data.kural.number}`;
            renderVerse(data.kural);
            document.getElementById('fallbackContainer').style.display = 'none';
            document.getElementById('verseSurface').style.display = 'flex';
        } else {
            renderSearchMiss(data);
        }
    } catch (err) {
        console.error("Search error:", err);
    }
}

// Render the Verse in Vertical Stack
function renderVerse(kural) {
    const t = I18N[currentLanguage];
    const verseSurface = document.getElementById('verseSurface');
    const fallbackContainer = document.getElementById('fallbackContainer');
    
    if (fallbackContainer) fallbackContainer.style.display = 'none';
    if (verseSurface) verseSurface.style.display = 'flex';

    // Meta Badge
    const metaText = currentLanguage === 'ta'
        ? `${kural.paal} · அதிகாரம் ${kural.adhigaram_number}: ${kural.adhigaram_name} · குறள் #${kural.number}`
        : `${kural.paal_en} · Chapter ${kural.adhigaram_number}: ${kural.adhigaram_name_en} · Kural #${kural.number}`;
    setElementText('verseMetaBadge', metaText);

    // Stack Card 1: Sacred Kural
    setElementText('kuralCardLabel', `${t.kuralLabel} #${kural.number}`);
    document.getElementById('kuralLine1').textContent = kural.line1;
    document.getElementById('kuralLine2').textContent = kural.line2;

    // Stack Card 2: Authoritative Explanations
    setElementText('headingPope', t.popeHeading);
    setElementText('headingTamil', t.taHeading);

    const coupletEl = document.getElementById('popeCouplet');
    if (coupletEl) coupletEl.textContent = kural.pope_couplet || kural.translation;

    const meaningEnEl = document.getElementById('popeMeaning');
    if (meaningEnEl) meaningEnEl.textContent = kural.explanation_en ? `Meaning: ${kural.explanation_en}` : '';

    const meaningTaEl = document.getElementById('tamilExplanation');
    if (meaningTaEl) meaningTaEl.textContent = kural.explanation_ta || '';

    // Stack Card 3: AI Story (Ready for Slice 3)
    setElementText('headingStory', t.storyHeading);
    const storyBody = document.getElementById('storyBody');
    if (storyBody) {
        storyBody.innerHTML = `
            <div style="text-align: center; padding: 18px 0; color: var(--text-muted);">
                <p style="margin-bottom: 12px; font-style: italic;">${t.storyPlaceholder}</p>
                <button class="btn-primary-action" id="triggerStoryBtn" onclick="triggerStoryGeneration(${kural.number})">
                    <span>✨</span> <span>${t.readStoryBtn}</span>
                </button>
            </div>
        `;
    }

    // Update bottom nav buttons
    setElementText('btnPrev', t.prevBtn);
    setElementText('btnNext', t.nextBtn);
    setElementText('btnBackSearch', t.backSearch);

    // Scroll to verse smoothly if user searched
    verseSurface.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Render Fallback Discovery on Search Miss
function renderSearchMiss(data) {
    const t = I18N[currentLanguage];
    const verseSurface = document.getElementById('verseSurface');
    const fallbackContainer = document.getElementById('fallbackContainer');

    if (verseSurface) verseSurface.style.display = 'none';
    if (fallbackContainer) {
        fallbackContainer.style.display = 'block';
        
        let kuralsHtml = '';
        if (data.fallback_kurals && data.fallback_kurals.length > 0) {
            kuralsHtml = data.fallback_kurals.map(k => `
                <div class="famous-card" onclick="loadKuralByNumber(${k.number})">
                    <div class="famous-num">Kural #${k.number} · ${currentLanguage === 'ta' ? k.adhigaram_name : k.adhigaram_name_en}</div>
                    <div class="famous-tamil">${k.line1}</div>
                    <div class="famous-en">${k.pope_couplet || k.translation}</div>
                </div>
            `).join('');
        }

        fallbackContainer.innerHTML = `
            <h3 class="fallback-title">${t.noMatchTitle}</h3>
            <p class="fallback-desc">${data.message || t.exploreFamous}</p>
            <div class="famous-grid">${kuralsHtml}</div>
            <div style="margin-top: 24px; text-align: center;">
                <button class="nav-link-btn" onclick="loadKuralByNumber(1)">${t.backSearch}</button>
            </div>
        `;
        fallbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Navigation Controls
function navigateNext() {
    if (currentKural) {
        loadKuralByNumber(currentKural.number + 1);
    }
}

function navigatePrev() {
    if (currentKural) {
        loadKuralByNumber(currentKural.number - 1);
    }
}

function scrollToSearch() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('searchInput').focus();
}

// Placeholder for Slice 3 AI Story trigger
function triggerStoryGeneration(number) {
    alert("AI Short-Story generation with trivia loading is arriving in Slice 3!");
}
