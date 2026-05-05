---
stage: 03-clarify
cycle: 001
project: Markdown Editor
created: 2026-05-04
status: COMPLETE
gate: PENDING_HUMAN
constitution-version: 1
---

# Clarification Record — Cycle 001

## Questions and Answers

| # | Question | Answer |
|---|---|---|
| 1 | Should the 150 ms debounce be hardcoded or configurable? | Configurable — expose as a constant in `config.ts` |
| 2 | Which highlight.js theme? Auto light/dark or fixed? | `github` theme, fixed for MVP |
| 3 | Sample Markdown stored as static `.md` asset or inline TS string? | Best practice — Vite `?raw` import of a static `sample.md` asset file |
| 4 | DOMPurify acceptable for XSS sanitisation? | Yes, acceptable |
| 5 | Responsive breakpoint at 768 px — arbitrary or from design system? | Fine for now, but must be configurable (CSS custom property) so a future design system can override it |
| 6 | What does the preview show when the editor is empty? | Display a "Nothing to preview" placeholder message |
| 7 | Fixed 50/50 split or draggable divider? | Fixed 50/50 for MVP |
| 8 | Should there be a visible header bar? | Yes — header showing the app name "Markdown Editor" |
| 9 | Editor textarea font — monospace or proportional? | Monospace |
| 10 | Tab key in editor — insert character or default browser behaviour? | Default browser behaviour (moves focus) |

---

## Spec Amendments

The following changes must be applied to `01-spec.md`:

- **FR-002 (amended)** — Editor textarea uses a monospace font. Tab key uses default browser behaviour (no custom insertion).
- **FR-003 (amended)** — Debounce delay is read from a `DEBOUNCE_MS` constant in `src/config.ts` (default: 150). Not hardcoded inline.
- **FR-004 (amended)** — highlight.js theme is `github`. Fixed for MVP; no system-preference switching.
- **FR-005 (amended)** — Sample document is stored as `src/assets/sample.md` and imported via Vite's `?raw` import (`import sampleContent from './assets/sample.md?raw'`).
- **FR-007 (amended)** — Responsive breakpoint is defined as a CSS custom property `--breakpoint-mobile` (default: `768px`) in `:root`, so a future design system can override it without touching component code.
- **FR-011 (new)** — When the editor content is empty (trimmed length === 0), the preview pane displays a centred placeholder: *"Nothing to preview"* in muted text.
- **FR-012 (new)** — The application renders a full-width header bar above the panes, containing the text "Markdown Editor" as an `<h1>`.

---

## Resolved Ambiguities

- Debounce is configurable via `src/config.ts` — one place to tune it, avoids magic numbers.
- `github` highlight.js theme is fixed for MVP; light/dark auto-switching deferred to a future cycle.
- Sample Markdown lives as a real `.md` file imported via `?raw` — keeps content out of TypeScript, version-controlled cleanly.
- Breakpoint is a CSS custom property so the design system can override it with a single variable change.
- Empty editor state is handled explicitly with a "Nothing to preview" message — no silent blank pane.
- Header is included; sets visual identity and makes the app feel complete even at MVP.
- Tab key uses default browser behaviour — no custom handling needed, keeps complexity low.

---

## Remaining Risks

- **highlight.js auto-detection accuracy** — `highlight.js` auto-detection can misidentify languages in short or ambiguous code blocks. Acceptable for MVP since the `github` theme degrades gracefully with no highlighting.
- **DOMPurify + marked interaction** — Some `marked` output (e.g., raw HTML passthrough) may interact unexpectedly with DOMPurify's default config. Should be validated during QA against common edge cases.
- **Bundle size** — `highlight.js` full build is ~1 MB unminified. Must import only the languages needed or use the `highlight.js/lib/core` + explicit language registration pattern to stay under the 300 KB gzipped budget.

---

## Human Gate
GATE: PENDING_HUMAN — Awaiting approval before planning begins.
