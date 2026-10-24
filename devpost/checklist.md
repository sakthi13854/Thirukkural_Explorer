---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Project scaffold, preloaded Thirukkural dataset, and FastAPI search API**
  Becomes usable: A running FastAPI server where you can search or fetch kurals (by number, words, or Athigaram) and receive the Tamil verse and G.U. Pope translation, verified in the browser.
  Why now: Bootstrapping lives in slice one. It proves the local 1,330-kural dataset and FastAPI routing end-to-end so all subsequent slices have a working application and data layer to build on.
  PRD ref: `prd.md > Language Selection & Search`, `prd.md > Verse Presentation & G.U. Pope Translation`
  Spec ref: `spec.md > Stack`, `spec.md > Backend: FastAPI Application Server`, `spec.md > Data Access: Thirukkural Service`, `spec.md > File Structure`
  Build: Scaffold project directory structure (`app/`, `app/data/`, `app/static/`), create `requirements.txt`, bundle `thirukkural.json` with 1,330 kurals and G.U. Pope translations, implement `app/data.py` with search and fallback logic, implement `app/main.py` with FastAPI endpoints, and add a minimal test UI to verify endpoints in the browser.
  Verify (mechanical): Start Uvicorn, test `GET /api/kural/1` and `GET /api/kural/search?q=1`, confirm response contains Kural 1 with G.U. Pope translation, and confirm non-matching search returns randomized famous kurals.
  Learner check: Open `http://localhost:8000/docs` in your browser, click "Try it out" on `/api/kural/{number}`, enter `1`, and see Kural 1's Tamil text and G.U. Pope translation returned live.
  Commit: `Scaffold project, preloaded dataset, and FastAPI search endpoints`

- [ ] **2. Oil-paint visual identity, glassmorphism UI, and vertical stack verse surface**
  Becomes usable: A fully styled web application with the warm brown oil-paint village hero, interactive search bar, language toggle (Tamil/English), sequential "Next Kural" navigation, and the vertical stack verse layout (Kural in distinct font followed by G.U. Pope explanation).
  Why now: Establishes the real user-facing UI and navigation loop so the AI story and loading screen can slot directly into the exact layout defined by the PRD.
  PRD ref: `prd.md > Screens and Layout`, `prd.md > Look and Feel`, `prd.md > Sequential Navigation & Fallbacks`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Frontend: Single Page Interface`, `spec.md > Components`
  Build: Build `app/static/index.html`, `app/static/style.css`, and `app/static/app.js`. Implement the oil-paint village hero aesthetic, warm brown color palette (`#3D2314`, sepia, parchment), glassmorphism cards, distinct font styling for the kural verses, language switcher, sequential next-kural button, and search miss fallback cards.
  Verify (mechanical): Request `http://localhost:8000/`, verify HTML loads with CSS and JS links, verify search renders verse stack in correct DOM order (kural header -> explanation), and verify sequential navigation advances to kural number + 1.
  Learner check: Open `http://localhost:8000`, experience the oil-paint home screen, search for a kural or click next, and see the verse rendered in its distinct classical font followed by G.U. Pope's translation in a vertical stack.
  Commit: `Add oil-paint glassmorphism UI and vertical stack verse surface`

- [ ] **3. Gemini AI short-story generation, in-memory caching, and trivia loading screen**
  Becomes usable: The complete unique kernel—viewing any kural triggers an engaging "Did you know?" trivia loading screen while Gemini generates a contextual short story in the selected language, which renders at the bottom of the stack and is cached for instant replay.
  Why now: Completes the central differentiator of the app by connecting the Gemini AI service, in-memory caching, and cultural loading screen to the live UI.
  PRD ref: `prd.md > AI Short-Story Generation with Trivia Loading`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > AI Service: Gemini Story Generator & Cache`, `spec.md > Frontend: Trivia Loading Screen`, `spec.md > Important Failure Modes`
  Build: Create `app/trivia.py` with curated Thirukkural trivia facts. Create `app/ai.py` with the Gemini SDK client, prompt crafting template, and in-memory cache dictionary. Add `GET /api/kural/{number}/story` endpoint. In frontend `app.js`, trigger the trivia loading overlay during story generation, render the completed story below G.U. Pope's explanation, and handle offline/quota failure fallbacks gracefully.
  Verify (mechanical): Send a story request to `/api/kural/1/story?lang=en`, confirm valid 2-3 paragraph story is returned, verify second request returns `cached: true` in <10ms, and verify trivia facts endpoint returns non-empty list.
  Learner check: Open the app, view a kural, see the cultural "Did you know?" trivia overlay while the story generates, and read the AI-generated story in your chosen language.
  Commit: `Add Gemini AI short story generation, in-memory cache, and trivia loading overlay`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — Slice 1 (API and preloaded dataset verified via `/docs` and browser)
- [ ] Final kick-the-tires exploration and feedback completed — Slice 3 (Complete app tested: search, trivia, stories, language toggle)

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: 
Route and stops: 
Edit outcome: 
Reflection: 
Activity mode: 

## Revisions
