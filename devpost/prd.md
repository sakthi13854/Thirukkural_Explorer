---
doc: prd
status: approved
---

# Thirukural Explainer Web App — Product Requirements

A bilingual interactive web app combining classical Thiruvalluvar verses with historical G.U. Pope translations and LLM-generated short-story explanations, presented in an oil-paint aesthetic for both Tamil and non-Tamil speakers.

Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`.

## The Core Journey

1. **Arrive** — The user opens the web app and sees the oil-paint hero illustration of Thiruvalluvar teaching in a village setting.
2. **Select Language & Search** — The user selects their preferred language (Tamil or English) and enters a search query: by kural number (1–1330), by the starting words of a verse, or by Athigaram (chapter) number.
3. **Handle Search Outcome** —
   - If found: Directly opens the selected kural.
   - If not found: Instead of an empty dead end, the app presents a randomized selection of famous/popular kurals for immediate exploration.
4. **Read the Kural & Explanation** — The verse view displays a vertical stack:
   - First, the sacred kural rendered in a distinct, reverent font style.
   - Second, the authoritative explanation (G.U. Pope's translation in English / Tamil commentary).
5. **Experience the AI Story** —
   - While the LLM generates the short-story explanation in the selected language, the user sees an engaging loading screen featuring "Did you know?" trivia facts about Thirukkural or Thiruvalluvar.
   - Once ready, the story appears at the bottom of the vertical stack.
6. **Sequential Exploration** — After finishing a kural, the user can navigate directly to the next kural in sequence by number, or return to search.
7. **What counts as success** — A user can arrive, pick a language, search by number or words, view the kural and G.U. Pope translation, read the AI story, and advance to the next verse within 2 minutes without friction.

## Screens and Layout

- **Home / Search Surface**:
  - Hero area: Oil-paint style painting of Thiruvalluvar teaching villagers.
  - Controls: Language selector (Tamil / English) and a search input supporting number, starting verse text, or Athigaram number.
  - Discovery fallback area: Displays randomized famous kurals when no match is found or for quick jumping.
- **Verse Surface**:
  - Single vertical stack containing:
    1. Kural verse header (distinct font).
    2. Explanation section (G.U. Pope translation in English, Tamil commentary).
    3. AI Short Story section (narrative explanation in chosen language).
  - Navigation controls: "Next Kural" button to advance sequentially, and "Back to Search" button to return.
- **Loading Overlay / Screen**:
  - Displayed during AI story generation.
  - Presents rotating/randomized "Did you know?" trivia facts about Thirukkural and Thiruvalluvar.

## Look and Feel

- **Aesthetic**: Traditional oil-paint texture, giving the impression of hand-tinted classical artwork.
- **Color Palette**: Warm earth tones and brown shades (`#3D2314`, warm sepia, cream parchment backgrounds).
- **Transitions & Surfaces**: Subtle glassmorphism overlays with soft blur and translucency over the oil-paint background.
- **Typography**:
  - The Kural itself uses a distinct, ornate classical font style to give the verse prominence and visual distinction.
  - Body text uses clean, readable bilingual fonts (clear modern Tamil typography paired with an elegant English sans/serif).
- **Tone**: Culturally rich, contemplative, and accessible to non-Tamil readers.

## Features and Behavior

### Language Selection & Search
- Source: `scope.md > The Core Loop`.
- As a reader, I can choose between Tamil and English so that the app displays explanations and stories in my preferred language.
  - [ ] Language choice updates the UI, explanation, and AI story language immediately.
- As a reader, I can search for a verse by entering its number (1–1330), its opening words, or its Athigaram number.
  - [ ] Exact number search (e.g., "1") loads that specific kural.
  - [ ] Text search matches starting words of Tamil verses or G.U. Pope English titles/lines.
  - [ ] Athigaram number search navigates to the first kural of that chapter.

### Verse Presentation & G.U. Pope Translation
- Source: `scope.md > The Unique Kernel`.
- As a reader, I want to see the kural clearly separated from secondary commentary.
  - [ ] The kural appears at the top of the stack in a distinct, emphasized font style.
  - [ ] The historical G.U. Pope translation appears directly beneath the verse in English (with Tamil explanation if Tamil is chosen).

### AI Short-Story Generation with Trivia Loading
- Source: `scope.md > The Unique Kernel`, `scope.md > What "Working" Looks Like`.
- As a reader, I want an AI-authored short story that illustrates the moral and real-world meaning of the kural.
  - [ ] While the story loads, the screen shows a "Did you know?" fact about Thiruvalluvar or the Thirukkural.
  - [ ] When generation completes, the story smoothly renders at the base of the vertical stack.
  - [ ] Generated stories are retained/cached in-memory for the session so revisiting does not trigger redundant generation.

### Sequential Navigation & Fallbacks
- Source: `scope.md > The Core Loop`.
- As a reader, I can easily continue reading through the text in order.
  - [ ] A "Next Kural" action advances sequentially (e.g., Kural 1 -> Kural 2).
  - [ ] If a search query yields no matches, the view displays randomized famous kurals with clickable cards to immediately start reading.

## States and Boundaries

- **First Use / Idle**: Home screen with Thiruvalluvar painting, language selector, and search bar.
- **Loading State**: An intrusive loading state displaying cultural "Did you know?" facts while the AI short story generates.
- **Search Miss State**: When a query doesn't match any verse or chapter, displays a curated/randomized list of famous kurals instead of an empty error.
- **Error State**: If AI generation fails (network or quota error), G.U. Pope's translation remains fully readable, and the story area displays a friendly retry prompt without crashing.
- **Session Boundary**: Language choice and cached stories remain active during the browser session; no account, database login, or cookie syncing required.

## Product Decisions

- **G.U. Pope 1886 Translation** — Corrected from earlier placeholder "Gurppe"; uses the renowned historical translation for scholarly accuracy and public-domain availability.
- **Vertical Stack Reading Layout** — Stacking Kural (distinct font) → Explanation (G.U. Pope) → AI Story creates a natural progressive reading flow.
- **Trivia Loading Screen** — Replaced a blank spinner with "Did you know?" facts to educate the user during AI generation latency.
- **No-Dead-End Search** — When a search query yields no results, presenting famous kurals randomly keeps the user exploring.
- **Sequential Reading Flow** — After a kural, navigating to `kural_number + 1` supports spontaneous continuing study.

## What We're Building

- Oil-paint styled web interface with warm brown tones and glassmorphism cards.
- Hero home page showing Thiruvalluvar teaching in a village.
- Language switcher (English / Tamil).
- Search mechanism by kural number, starting words, or Athigaram number.
- Fallback recommendation of famous kurals on search miss.
- Vertical verse view: Kural in distinct font + G.U. Pope translation + AI short-story.
- Trivia loading screen during AI story generation.
- Sequential next-kural navigation and return to search.
- In-session caching of generated stories.

## Deferred From the POC

- Persistent user accounts, authentication, and profile tracking.
- Bookmarks and personal reading history saved across browser restarts.
- Social sharing cards or quote image exports.
- Full 133-chapter browsing hierarchy with nested tree navigation.
- Voice/audio recitations of the Tamil verses.

## Possible Later Enhancements

- Audio recitation in traditional rhythmic Tamil.
- Thematic category exploration (e.g., Friendship, Leadership, Love, Ethics).
- Exportable shareable quote images with oil-paint styling.
- LocalStorage bookmarking for favorite kurals.

## Non-Goals

- Not building an exhaustive dictionary or grammatical parser of Sangam/classical Tamil.
- Not requiring user accounts, email capture, or backend authentication.
- Not generating on-the-fly AI images for every kural (using curated oil-paint aesthetic and hero art).

## Open Questions

- Which LLM model/endpoint provides the best bilingual Tamil/English storytelling with low latency (addressed in `4-spec`)?
- Curated list of 10–15 "Did you know?" trivia facts to bundle for the loading screen (can be assembled in build/spec).
