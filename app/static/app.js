// Thirukural Explainer — Frontend Controller (Slice 3 Complete)

let currentLanguage = sessionStorage.getItem('thirukural_lang') || 'en';
let currentKural = null;
let triviaList = [];
let triviaInterval = null;
let currentTriviaIndex = 0;

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
        readStoryBtn: "Generate Story Illustration",
        storyPlaceholder: "Click below to weave a contemporary short-story that illustrates the moral of this kural.",
        prevBtn: "← Previous",
        nextBtn: "Next Kural →",
        backSearch: "🔍 Home & Search",
        noMatchTitle: "No exact verse found",
        exploreFamous: "Explore these celebrated kurals instead:",
        triviaTitle: "Did You Know?",
        triviaSub: "Weaving an illustrative story with Gemini AI...",
        cachedBadge: "⚡ In-Session Memory",
        geminiBadge: "Gemini 2.5 Flash",
        retryBtn: "Retry Generation",
        errorStory: "The storyteller encountered a temporary delay. Please click retry."
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
        readStoryBtn: "கதை விளக்கம் உருவாக்குக",
        storyPlaceholder: "இக்குறளின் வாழ்வியல் கருத்தை விளக்கும் எளிய வாழ்வியல் சிறுகதையைப் படிக்க கீழே அழுத்தவும்.",
        prevBtn: "← முந்தைய குறள்",
        nextBtn: "அடுத்த குறள் →",
        backSearch: "🔍 முகப்பு / தேடல்",
        noMatchTitle: "குறள் எதுவும் கிடைக்கவில்லை",
        exploreFamous: "புகழ்பெற்ற இந்த அருங்குறள்களைக் காண்க:",
        triviaTitle: "உங்களுக்குத் தெரியுமா?",
        triviaSub: "ஜெமினி செயற்கை நுண்ணறிவால் கதை விளக்கம் தயாராகிறது...",
        cachedBadge: "⚡ நினைவகப் பதிவு",
        geminiBadge: "ஜெமினி 2.5 ஃப்ளாஷ்",
        retryBtn: "மீண்டும் முயற்சிக்க",
        errorStory: "கதை உருவாக்கத்தில் தற்காலிக தாமதம் ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்."
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
    updateLanguageUI();
    loadTriviaFacts();
    
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

async function loadTriviaFacts() {
    try {
        const res = await fetch('/api/trivia');
        if (res.ok) {
            triviaList = await res.json();
        }
    } catch (e) {
        console.warn("Could not preload trivia facts:", e);
    }
}

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

    setElementText('uiAppTitle', t.appTitle);
    setElementText('uiAppSubtitle', t.appSubtitle);
    setElementText('uiHeroTag', t.heroTag);
    setElementText('uiHeroTitle', t.heroTitle);
    setElementText('uiHeroSub', t.heroSub);
    setElementText('uiQuickLabel', t.quickPicks);
    setElementText('uiSearchBtn', t.searchBtn);
    setElementText('uiTriviaTitle', t.triviaTitle);
    setElementText('uiTriviaSub', t.triviaSub);
    
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

    // Stack Card 3: AI Story Trigger / Content
    setElementText('headingStory', t.storyHeading);
    const storyBadge = document.querySelector('.story-badge');
    if (storyBadge) storyBadge.textContent = t.geminiBadge;

    const storyBody = document.getElementById('storyBody');
    if (storyBody) {
        storyBody.innerHTML = `
            <div style="text-align: center; padding: 20px 0; color: var(--text-secondary);">
                <p style="margin-bottom: 14px; font-style: italic;">${t.storyPlaceholder}</p>
                <button class="btn-primary-action" id="triggerStoryBtn" onclick="triggerStoryGeneration(${kural.number})">
                    <span>✨</span> <span>${t.readStoryBtn}</span>
                </button>
            </div>
        `;
    }

    // Bottom navigation buttons
    setElementText('btnPrev', t.prevBtn);
    setElementText('btnNext', t.nextBtn);
    setElementText('btnBackSearch', t.backSearch);
}

// Slice 3: Trigger AI Short-Story with Trivia Overlay
async function triggerStoryGeneration(kuralNumber) {
    const t = I18N[currentLanguage];
    const overlay = document.getElementById('triviaOverlay');
    const factBox = document.getElementById('triviaFactBox');
    const storyBody = document.getElementById('storyBody');
    const storyBadge = document.querySelector('.story-badge');

    // Show trivia overlay & cycle facts
    if (overlay) {
        overlay.style.display = 'flex';
        showNextTriviaFact();
        if (triviaInterval) clearInterval(triviaInterval);
        triviaInterval = setInterval(showNextTriviaFact, 3500);
    }

    try {
        const res = await fetch(`/api/kural/${kuralNumber}/story?lang=${currentLanguage}`);
        if (!res.ok) throw new Error("Could not fetch story");
        const data = await res.json();

        // Format paragraphs nicely
        const paragraphs = data.story
            .split('\n\n')
            .filter(p => p.trim() !== '')
            .map(p => `<p>${p.trim()}</p>`)
            .join('');

        if (storyBody) {
            storyBody.innerHTML = paragraphs;
        }

        if (storyBadge) {
            storyBadge.textContent = data.cached ? t.cachedBadge : t.geminiBadge;
            if (data.cached) {
                storyBadge.style.background = 'linear-gradient(135deg, #2D6A4F, #1B4332)';
            } else {
                storyBadge.style.background = 'linear-gradient(135deg, var(--warm-sepia), var(--primary-brown))';
            }
        }
    } catch (err) {
        console.error("Story generation error:", err);
        if (storyBody) {
            storyBody.innerHTML = `
                <div style="text-align: center; padding: 16px; color: #9C3325;">
                    <p>${t.errorStory}</p>
                    <button class="nav-link-btn" style="margin-top: 10px;" onclick="triggerStoryGeneration(${kuralNumber})">${t.retryBtn}</button>
                </div>
            `;
        }
    } finally {
        if (triviaInterval) clearInterval(triviaInterval);
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
}

function showNextTriviaFact() {
    const factBox = document.getElementById('triviaFactBox');
    if (!factBox || !triviaList || triviaList.length === 0) return;

    factBox.style.opacity = '0';
    setTimeout(() => {
        const item = triviaList[currentTriviaIndex];
        const text = item[currentLanguage] || item['en'];
        factBox.textContent = text;
        factBox.style.opacity = '1';
        currentTriviaIndex = (currentTriviaIndex + 1) % triviaList.length;
    }, 200);
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
