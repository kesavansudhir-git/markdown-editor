---
stage: 02-specify
cycle: 001
project: Markdown Editor
created: 2026-05-04
status: COMPLETE
gate: N/A
constitution-version: 1
---

# Functional Specification — Cycle 001

## Feature Summary
Build the MVP of the Markdown Editor: a browser-based, split-pane application where a user writes Markdown in a left-hand editor pane and sees a live-rendered HTML preview in the right-hand pane. The preview updates in real time as the user types. This is the core loop of the application — everything else in future cycles builds on top of this foundation.

---

## User Stories

- As a writer, I want to type Markdown in an editor pane so that I can author content without switching tools.
- As a writer, I want to see a rendered HTML preview update as I type so that I can immediately verify how my Markdown will look.
- As a reader, I want fenced code blocks to have syntax highlighting so that technical content is easy to scan.
- As a user, I want the editor and preview panes to scroll independently so that I can write long documents comfortably.
- As a user, I want the application to load with sample Markdown content so that I can immediately see the editor in action without a blank screen.

---

## Functional Requirements

1. **FR-001** — The application renders a two-column split-pane layout: editor on the left, preview on the right, each occupying 50% of the viewport width.
2. **FR-002** — The left pane contains a plain `<textarea>` accepting raw Markdown input, rendered in a monospace font. Tab key uses default browser behaviour (moves focus; no character insertion).
3. **FR-003** — The right pane renders the Markdown as HTML using the `marked` library. Rendering is triggered on every `input` event, debounced by `DEBOUNCE_MS` (defined in `src/config.ts`, default: 150 ms).
4. **FR-004** — Fenced code blocks in the preview are syntax-highlighted using `highlight.js` with the `github` theme (fixed; no system-preference switching for MVP).
5. **FR-005** — The editor loads with a pre-written sample Markdown document on first render. The document is stored as `src/assets/sample.md` and imported via Vite's `?raw` import.
6. **FR-006** — The editor and preview panes each scroll independently via their own overflow containers.
7. **FR-007** — The application is responsive: below the mobile breakpoint, the layout switches to a single-column stacked view (editor on top, preview below). The breakpoint is defined as CSS custom property `--breakpoint-mobile` in `:root` (default: `768px`).
8. **FR-008** — The page title displayed in the browser tab reads "Markdown Editor".
9. **FR-009** — The application is built with React 18 + Vite + TypeScript and passes all four quality gate commands (`typecheck`, `lint`, `test`, `build`).
10. **FR-010** — Markdown parsing logic lives exclusively in a `useMarkdown` hook; no parsing occurs inside JSX render functions.
11. **FR-011** — When the editor content is empty (trimmed length === 0), the preview pane displays a centred placeholder: *"Nothing to preview"* in muted text.
12. **FR-012** — The application renders a full-width header bar above the split panes, containing the app name "Markdown Editor" as an `<h1>`.

---

## Non-Functional Requirements

- **Performance** — Preview re-render latency must be ≤ 100 ms after the debounce fires (constitution budget).
- **Bundle size** — Production JS bundle must be < 300 KB gzipped (constitution budget).
- **Accessibility** — The editor `<textarea>` must have an accessible label (`aria-label` or `<label>`). Preview pane must be a `role="region"` with `aria-label="Preview"`.
- **Security** — Rendered HTML must be sanitised with `DOMPurify` before injection to prevent XSS from crafted Markdown input.
- **Browser support** — Must work on the latest stable release of Chrome, Firefox, Safari, and Edge.

---

## Out of Scope

- File open / save / export (future cycle)
- Toolbar with formatting buttons (future cycle)
- Dark mode / theme switching (future cycle)
- Scroll sync between editor and preview (future cycle)
- Collaborative editing (out of scope for this project)
- Backend / server-side rendering

---

## Acceptance Criteria

- [ ] **AC-001** — Launching the app shows two equal-width panes side by side; the editor contains sample Markdown and the preview shows its rendered output.
- [ ] **AC-002** — Typing in the editor updates the preview within 150 ms (debounce) + render time, visually with no full-page reload.
- [ ] **AC-003** — A fenced code block (e.g., ` ```js `) in the editor renders with syntax colouring in the preview.
- [ ] **AC-004** — Scrolling one pane does not move the other.
- [ ] **AC-005** — At viewport width < 768 px, the panes stack vertically (editor above, preview below).
- [ ] **AC-006** — Browser tab reads "Markdown Editor".
- [ ] **AC-007** — `npm run typecheck` exits 0 with zero errors.
- [ ] **AC-008** — `npm run lint` exits 0 with zero errors.
- [ ] **AC-009** — `npm run test` passes all unit tests (≥ 80% coverage on `markdownUtils`).
- [ ] **AC-010** — `npm run build` produces a dist bundle; gzipped JS < 300 KB.
- [ ] **AC-011** — Injecting `<script>alert(1)</script>` as Markdown input does not execute JavaScript in the preview pane.
- [ ] **AC-012** — Clearing the editor to empty shows "Nothing to preview" in the preview pane.
- [ ] **AC-013** — A header bar is visible above the panes with the text "Markdown Editor".

---

## Open Questions (for Clarify stage)

- **Q1** — Should the debounce delay be configurable, or is 150 ms hardcoded for the MVP?
- **Q2** — Which `highlight.js` theme should be used for code blocks (e.g., GitHub, Atom One Dark)? Should it match a light/dark system preference?
- **Q3** — Should the sample Markdown document be stored as a static `.md` asset file, or as an inline TypeScript string constant?
- **Q4** — Is `DOMPurify` the agreed sanitisation library, or is a lighter alternative (e.g., `isomorphic-dompurify`) acceptable for a browser-only app?
- **Q5** — Does the responsive breakpoint (768 px) need to match any existing design system, or is it arbitrary for the MVP?
