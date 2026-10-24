---
doc: scope
status: approved
---
<!-- `status` is the progress state every skill reads. Write `draft` when you first save this file,
     and change it to `approved` when the learner clearly approves the displayed plan ("looks good" counts).
     Do not request a second sign-off. Never skip the draft save —
     an unsaved draft dies with the conversation. -->

<!-- Scope is a rough sketch of the heart of the idea — NOT the detailed product
     definition. Resist the urge to fill this out exhaustively: features, screens,
     and behavior belong in the PRD, which comes next. Capture what makes this
     project distinctive and what belongs in a coherent proof of concept.
     Add a section if the conversation surfaced something important that
     doesn't fit below. Keep it short and readable. -->

# Thirukural Explainer Web App

A bilingual, interactive Thirukural explainer for both Tamil and non-Tamil speakers, combining curated Gurppe translations of each kural with an LLM-generated short-story explanation in the user's preferred language — delivered as a modern, oil-paint, glassmorphism web app with brown-shade styling and a village-painting home page.

## The Unique Kernel
The only app combines **Gurppe translation + LLM short-story explanation** per verse, presented bilingually (English or Tamil) in an oil-paint glassmorphism UI — none of the existing sites offer this interactive bilingual deep-explainer experience.

## Who It's For
Both Tamil speakers who want a richer reading experience and non-Tamil speakers who want to explore one of humanity's greatest ethical scripts, using simple UI and easy navigation.

## The Core Loop
Open → Thiruvalluvar portrait offers random kural choices + historical legacy intro → browse Palai → Eeyal → Athigaram, choosing chapters and verses → read the kural, Gurppe translation, and an LLM-generated short story in the chosen language → feel the oil-paint aesthetic.

## What "Working" Looks Like
User opens the app on the oil-paint home page featuring a small-village Thiruvalluvar painting, clicks a random kural, toggles between English and Tamil, reads the Gurppe translation alongside a short AI-generated story explaining the verse — all within a few minutes of demo.

## The POC Boundary
**In**: bilingual verse display with Gurppe translations + LLM-generated short stories; oil-paint glassmorphism aesthetic with brown shades; Palai → Eeyal → Athigaram navigation.
**Cut (LLM)**: LLM-generated intrusive oil paintings (risky at PoC time, hard to demo convincingly); per-verse reordering beyond a simple list.
**Cut**: legacy-history text beyond the brief intro on home page.

## Later
Oil-paint intrusive paintings generation; more navigation flows; full historical context sections; batch verse loading.

## Explicitly Cut
- **LLM oil paintings** — risky/hard to demo at PoC time; can be planned after core works.
- **Detailed historical narrative** on home page — scope for later.