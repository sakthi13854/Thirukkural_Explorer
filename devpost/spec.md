---
doc: spec
status: approved
---

# Thirukural Explainer Web App — Technical Spec

## How This Works, In Plain Language

The Thirukural Explainer is built as a single, lightweight Python web application. When started, a **FastAPI** server loads a local dataset of all 1,330 Thirukkural verses (including Tamil text and historical 1886 **G.U. Pope** English translations) directly into memory. 

When you open the app in your browser, the frontend displays an oil-paint themed home page featuring Thiruvalluvar teaching in a village. You choose your language (Tamil or English) and enter a search query (kural number, verse opening words, or Athigaram number). The browser asks FastAPI for the matching verse. If found, the verse renders in a vertical stack: first the sacred kural in a distinctive classical font, followed by G.U. Pope's translation and commentary.

To explain the verse's moral meaning in human terms, the backend calls the **Google Gemini API** (`gemini-2.5-flash`) using a bilingual prompt crafted with the verse and translation. While Gemini generates this story, an overlay displays "Did you know?" trivia facts about Thirukkural so the reader is entertained rather than staring at a blank spinner. Once returned, the story is saved in an in-memory cache and displayed at the bottom of the stack. Clicking "Next Kural" instantly advances to the next verse in sequence.

We chose this architecture because it puts the entire application inside a single Python environment with zero external database configuration, allowing you to focus directly on learning backend routing, API endpoints, and AI integration in 2–4 hours.

## The Core Journey Through the System

Implements `prd.md > The Core Journey`.

```
[ User Browser ]
       │
       ▼ 1. Opens http://localhost:8000
[ FastAPI Server ] ──loads──▶ [ static/index.html & static/style.css ]
       │
       ▼ 2. User searches (number / words / adhigaram)
[ GET /api/kural/search?q=... ] ──reads──▶ [ In-Memory thirukkural.json ]
       │
       ├── (Found) ──▶ Returns Kural + G.U. Pope translation
       └── (Not Found) ──▶ Returns 5 randomized famous kurals
       │
       ▼ 3. Browser renders Vertical Stack & triggers Story Request
[ GET /api/kural/{id}/story?lang=... ]
       │
       ├── Cache Hit? ──▶ Returns cached story immediately
       │
       └── Cache Miss?
             │
             ├── Browser displays Trivia Loading Overlay
             │
             ├── FastAPI crafts prompt & calls Google Gemini API
             │
             └── Gemini returns story ──▶ Cache updated ──▶ Browser renders story
```

1. **Arrival**: The browser requests `/`, and FastAPI serves `static/index.html` styled with warm brown tones, glassmorphism cards, and the village oil-paint background.
2. **Search / Discovery**: The user enters a search query. The frontend script calls `GET /api/kural/search?q={query}`. The backend searches the preloaded dataset. If found, it returns the verse JSON. If not found, it returns randomized famous kurals as fallback suggestions.
3. **Verse Display**: The browser renders the kural verse in a distinct font at the top of the stack, followed by G.U. Pope's translation.
4. **Story Generation & Trivia**: The browser immediately calls `GET /api/kural/{number}/story?lang={language}` and displays the "Did you know?" trivia overlay. FastAPI checks its in-memory dictionary cache. On a miss, it crafts a prompt, calls Gemini 2.5 Flash, caches the resulting text, and returns it. The browser hides the trivia overlay and smoothly renders the story at the bottom of the stack.
5. **Next Kural Sequence**: The user clicks "Next Kural". The browser requests Kural `number + 1` from the API, repeating the flow.

## Stack

- **Backend Framework**: **FastAPI** (`>=0.110.0`)
  - [FastAPI Documentation](https://fastapi.tiangolo.com/)
  - *Rationale*: Clean, async Python backend that fulfills the learner's goal of understanding backend routing and request lifecycles. Automatically generates interactive API testing docs at `/docs`.
- **Application Server**: **Uvicorn** (`>=0.29.0`)
  - [Uvicorn Documentation](https://www.uvicorn.org/)
  - *Rationale*: Standard ASGI web server for running FastAPI locally and in production.
- **AI SDK**: **Google GenAI SDK** (`google-genai>=0.1.1` or `google-generativeai`)
  - [Google GenAI Documentation](https://ai.google.dev/gemini-api/docs)
  - *Rationale*: Fast bilingual output (Tamil + English) with Gemini 2.5 Flash, low generation latency, and simple API key setup.
- **Data Validation & Settings**: **Pydantic** (`>=2.0`) & **Python-Dotenv** (`>=1.0.0`)
  - [Pydantic Documentation](https://docs.pydantic.dev/)
  - *Rationale*: Structured type validation for API request/response contracts and safe `.env` API key loading.
- **Data Format**: Local static **JSON** (`thirukkural.json`)
  - *Rationale*: Preloaded on server startup into Python dictionaries for sub-millisecond lookups; requires zero database maintenance.
- **Frontend**: **HTML5, CSS3, Vanilla JavaScript (ES6+)**
  - *Rationale*: Eliminates Node.js build pipelines and npm dependencies. Allows complete control over glassmorphism styling, custom fonts, and oil-paint textures.

## Where It Runs and How Someone Tries It

### Local Development & Demo Recording (Required)
- **Runtime**: Python 3.10+ and any modern web browser.
- **Environment**: Set `GEMINI_API_KEY=your_key_here` in a `.env` file.
- **Startup Command**:
  ```bash
  uvicorn app.main:app --reload --port 8000
  ```
- **What to Open**:
  - Application UI: `http://localhost:8000`
  - Interactive API Docs: `http://localhost:8000/docs`
- **Submission Requirements**: A public GitHub repository and a 1–3 minute demo video demonstrating language selection, search by number and text, the trivia loading overlay, the G.U. Pope translation, the AI story, and sequential navigation.

### Optional Free Cloud Deployment
- **Platform**: **Render** (Free Web Service tier).
- **Deploy Configuration**:
  - Environment: Python 3
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  - Environment Variable: `GEMINI_API_KEY` set in the Render Dashboard.
- **Cost**: 100% free with no credit card required.

## Look and Feel

Implements `prd.md > Look and Feel`.

- **Oil-Paint Aesthetic**: Warm canvas background, subtle paint-stroke textures, and hand-tinted styling referencing classical Indian and Tamil art.
- **Color Palette**:
  - Deep Heritage Brown: `#3D2314` (primary text, borders, accents)
  - Warm Sepia / Ochre: `#7A4B29` and `#B87333` (secondary elements, card outlines)
  - Antique Parchment: `#FAF6EE` / `#F3EBDD` (backgrounds)
  - Glass Overlay: `rgba(250, 246, 238, 0.75)` with `backdrop-filter: blur(12px)`
- **Typography**:
  - **The Kural**: A distinct classical Tamil serif/ornate font (e.g. Google Font *Mukta Malar* or *Noto Serif Tamil*) styled larger with high line spacing for visual reverence.
  - **Explanations & Stories**: High-legibility sans-serif pairing (e.g. *Inter* or system sans for English, paired with clear Tamil text).
- **Layout**: Clean vertical stack on the verse screen; floating translucent search bar on the home screen over the village painting hero.

## Components

### Frontend: Single Page Interface
Implements `prd.md > Screens and Layout`, `prd.md > Language Selection & Search`, `prd.md > Verse Presentation & G.U. Pope Translation`.
- Serves the home screen and verse reading views without page reloads.
- Contains the language toggle (English/Tamil) which updates UI labels and query parameters.
- Search bar listening for input: digits (kural number), Tamil/English letters (text matching), or "adhigaram 5" (chapter lookup).
- Renders the verse in the vertical stack order: Kural (distinct font) $\rightarrow$ G.U. Pope translation $\rightarrow$ AI story container.
- File: `app/static/index.html`, `app/static/app.js`, `app/static/style.css`.

### Frontend: Trivia Loading Screen
Implements `prd.md > AI Short-Story Generation with Trivia Loading`.
- An intrusive modal/overlay that activates as soon as a story request is dispatched to the backend.
- Displays rotating "Did you know?" facts about Thiruvalluvar, the age of the script, its 133 chapters, and historical trivia.
- Automatically dismisses with a smooth fade when the backend returns the generated story JSON.
- File: `app/static/app.js`, `app/static/style.css`.

### Backend: FastAPI Application Server
Implements `prd.md > Screens and Layout`, `prd.md > Sequential Navigation & Fallbacks`.
- Serves static assets (`/static`) and mounts the HTML single-page app at `/`.
- Exposes RESTful endpoints:
  - `GET /api/kural/{number}`: Fetches specific kural, translation, and chapter data.
  - `GET /api/kural/search?q={query}`: Multi-mode search with fallback randomized famous kurals.
  - `GET /api/kural/{number}/story?lang={lang}`: Returns cached or newly generated AI short story.
  - `GET /api/trivia`: Returns curated Thirukkural trivia items.
- File: `app/main.py`.

### Data Access: Thirukkural Service
Implements `prd.md > Language Selection & Search`, `prd.md > Verse Presentation & G.U. Pope Translation`.
- Loads `app/data/thirukkural.json` at application startup.
- Indexes verses by number (1 to 1330) and Athigaram number (1 to 133).
- Performs case-insensitive prefix matching on Tamil verse lines and English translation titles.
- Provides fallback list of curated/famous kurals (e.g., Kural 1 "அகர முதல", Kural 391 "கற்க கசடற", etc.).
- File: `app/data.py`.

### AI Service: Gemini Story Generator & Cache
Implements `prd.md > AI Short-Story Generation with Trivia Loading`.
- Formats structured bilingual prompts incorporating the kural text and G.U. Pope's translation.
- Calls Gemini 2.5 Flash via `google-genai` SDK.
- Maintains an in-memory dictionary `STORY_CACHE: dict[str, str]` keyed by `{kural_number}_{language}` to prevent duplicate API calls during the session.
- Handles rate-limit or network errors gracefully by returning a clean error message and retry flag.
- File: `app/ai.py`.

## Data Model

### Kural Item Schema
```python
class Kural(BaseModel):
    number: int                 # 1 to 1330
    line1: str                  # Tamil first line
    line2: str                  # Tamil second line
    translation: str            # G.U. Pope English translation
    explanation_ta: str         # Tamil commentary/meaning
    adhigaram_number: int       # 1 to 133
    adhigaram_name: str         # Chapter name (Tamil)
    adhigaram_name_en: str      # Chapter name (English)
    paal: str                   # Aram / Porul / Inbam
```

### Story Request & Response Schema
```python
class StoryResponse(BaseModel):
    kural_number: int
    language: str               # "ta" or "en"
    story: str
    cached: bool
```

### State Storage & Lifecycle
- **Verse Data**: Read-only static JSON file loaded into Python memory on startup.
- **Story Cache**: In-memory Python dictionary stored in the FastAPI process (`app/ai.py`). Persists as long as the server process is alive.
- **User Preference**: Selected language (`ta` or `en`) stored in browser `sessionStorage`; defaults to Tamil for Tamil users and English for non-Tamil users.

## File Structure

```
Build_with_basic/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app initialization, routes, static mounts
│   ├── data.py              # Loads JSON, search algorithms, famous kurals fallback
│   ├── ai.py                # Gemini SDK client, prompt crafting, in-memory cache
│   ├── trivia.py            # Curated 'Did you know?' facts about Thirukkural
│   ├── data/
│   │   └── thirukkural.json # Complete 1330 verses with G.U. Pope translations
│   └── static/
│       ├── index.html       # Single-page UI (home hero, search, vertical stack, trivia overlay)
│       ├── style.css        # Oil-paint aesthetic, brown palette, glassmorphism, fonts
│       └── app.js           # Frontend logic: API calls, DOM rendering, navigation
├── devpost/                 # Hackathon learning documentation
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   └── spec.md
├── .env.example             # Template for GEMINI_API_KEY
├── requirements.txt         # fastapi, uvicorn, google-genai, python-dotenv, pydantic
└── README.md                # Local run instructions and project overview
```

## External Services and Dependencies

1. **Google Gemini API**
   - **Provider**: Google AI Studio / Google GenAI SDK
   - **Model**: `gemini-2.5-flash`
   - **Endpoint**: Handled through `genai.Client(api_key=...)`
   - **Key Requirement**: `GEMINI_API_KEY` environment variable.
   - **Cost / Limits**: Free tier allows up to 15 Requests Per Minute (RPM), perfectly suited for PoC testing.
   - **Doc Link**: https://ai.google.dev/gemini-api/docs
2. **Render (Optional Hosting)**
   - **Target**: Free Web Service
   - **Setup**: Connect public GitHub repo, set environment variables, automatic deploy.
   - **Doc Link**: https://render.com/docs/web-services

## Important Failure Modes

- **Gemini API Outage / Rate Limit**:
  - *Trigger*: Too many requests in 1 minute, network failure, or invalid API key.
  - *Fallback*: The verse and G.U. Pope translation remain fully visible and readable. The story container displays a polite notice ("The storyteller is momentarily unavailable. Click to retry.") with a manual retry button, preventing app crashes.
- **Search Query Finds No Match**:
  - *Trigger*: User enters a kural number > 1330 or a search term with no matches.
  - *Fallback*: The UI displays: "No verse found for '[query]'. Here are some celebrated kurals to explore:" followed by 5 clickable randomized famous kurals.
- **Missing `GEMINI_API_KEY` on Local Run**:
  - *Trigger*: Starting the app without configuring `.env`.
  - *Fallback*: FastAPI logs a clear terminal message at startup (`Warning: GEMINI_API_KEY not found. Story generation will use mock fallback stories`). Mock stories are served so the app can still be tested and demonstrated offline.

## What Was Simplified and Why

- **In-Memory Python Dictionary Cache instead of Redis / Database**:
  - *Why*: A dictionary requires zero installation, zero cost, and zero configuration, while delivering instant sub-millisecond cached stories for repeated visits.
- **Local JSON File instead of PostgreSQL / SQLite**:
  - *Why*: All 1,330 Thirukkural verses fit easily in under 1 MB of memory. Preloading them into a Python list/dict makes search instantaneous without managing SQL connections.
- **Vanilla HTML/CSS/JS instead of React / Next.js**:
  - *Why*: Eliminates `npm install`, Node.js version conflicts, and build toolchains. Allows the learner to run the entire project with a single `uvicorn` command while retaining full CSS control over the oil-paint glassmorphism aesthetic.
- **Sequential Navigation instead of Complex Graph / Athigaram Tree**:
  - *Why*: Direct "Next Kural" navigation lets readers flow continuously through verses without needing complicated multi-level navigation drawers.

## Decisions and Open Issues

### Learner Choices & Decisions
- **Backend Stack**: Selected FastAPI (Python) to satisfy the learner's goal of understanding modern backend frameworks, routing, and request lifecycles.
- **AI Stack**: Google Gemini 2.5 Flash via `google-genai` for fast, culturally attuned bilingual short stories.
- **Translation Source**: G.U. Pope's 1886 classical translation for scholarly authority and public domain licensing.
- **Verse Layout**: Vertical stack (Kural in distinct font $\rightarrow$ G.U. Pope explanation $\rightarrow$ AI short story).
- **Trivia Loading Screen**: "Did you know?" facts about Thiruvalluvar displayed during generation to make latency engaging.
- **Search Fallback**: Pushing randomized famous kurals when a search misses to eliminate dead ends.
- **Hosting Choice**: Local execution for required video recording, with documented free Render deployment for optional live URL.

### Useful Unknown Clarified
- **Backend-to-AI Connection & Prompt Crafting**: Clarified how Python formats prompt templates with verse and translation variables, how FastAPI calls the Gemini SDK, and how in-memory caching avoids duplicate calls. Also clarified how FastAPI's automatic `/docs` interface enables visual testing before writing frontend code.

### Resolved Questions from PRD
- *LLM Provider*: Google Gemini 2.5 Flash selected for low latency and bilingual accuracy.
- *Story Quality Check*: Prompt explicitly injects G.U. Pope's meaning to anchor the story faithfully to the verse's ethical core.
