---
stage: 06-tasks
cycle: 001
project: Markdown Editor
created: 2026-05-04
status: COMPLETE
gate: N/A
constitution-version: 1
---

# Task Breakdown — Cycle 001

## Task List

### Milestone 1 — Foundation

- [x] TASK-001 | S | **Scaffold Vite + React + TypeScript project**
  - What: Run `npm create vite@latest . -- --template react-ts`. Delete boilerplate: `src/App.css`, `src/assets/react.svg`, reset `src/App.tsx` to a blank export, clear `src/main.tsx` to minimal mount only.
  - File(s): project root, `src/App.tsx`, `src/main.tsx`
  - Done when: `npm run dev` starts without errors and renders a blank page; no boilerplate SVG or Vite logo visible
  - Dependencies: none

- [x] TASK-002 | S | **Install all runtime and dev dependencies**
  - What: Run the three install commands from the plan in sequence:
    1. `npm install marked@^9.0.0 marked-highlight highlight.js dompurify`
    2. `npm install -D @types/dompurify eslint typescript-eslint eslint-plugin-react-hooks`
    3. `npm install -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom`
  - File(s): `package.json`, `package-lock.json`
  - Done when: `npm ls marked` shows `9.x`; all packages listed in `node_modules`; `npm install` exits 0 with no peer-dep errors
  - Risk: RISK-001 — verify `marked` resolves to `^9.x` not a newer major
  - Dependencies: TASK-001

- [x] TASK-003 | M | **Configure Vite, Vitest, ESLint, and npm scripts**
  - What: (a) Add `test` block to `vite.config.ts` with `environment: 'jsdom'`, `globals: true`, `coverage` via `@vitest/coverage-v8`. (b) Add scripts to `package.json`: `"typecheck": "tsc --noEmit"`, `"lint": "eslint src"`, `"test": "vitest run --coverage"`. (c) Create `eslint.config.js` with `typescript-eslint` + `eslint-plugin-react-hooks` flat config.
  - File(s): `vite.config.ts`, `package.json`, `eslint.config.js`
  - Done when: `npm run typecheck`, `npm run lint`, `npm run test` all exit 0 (test output shows 0 test files found — that is fine at this stage)
  - Risk: RISK-002/G-03 — `environment: 'jsdom'` must be set or DOMPurify will fail in tests
  - Dependencies: TASK-002

- [x] TASK-004 | S | **Baseline bundle size check**
  - What: Run `npm run build`. Measure gzipped JS output size (`ls -lh dist/assets/*.js` then verify with `gzip -c dist/assets/*.js | wc -c`). Record the baseline in a comment at the top of `vite.config.ts`.
  - File(s): `vite.config.ts` (comment only)
  - Done when: Gzipped JS is confirmed < 300 KB before any application code is written; result is documented
  - Risk: RISK-004 — catch an accidental full hljs import before it lands in app code
  - Dependencies: TASK-003

---

### Milestone 2 — Core Logic

- [x] TASK-005 | S | **Create `src/config.ts`**
  - What: Create file exporting `DEBOUNCE_MS = 150` as a named constant.
  - File(s): `src/config.ts`
  - Done when: `import { DEBOUNCE_MS } from './config'` resolves without error; `npm run typecheck` passes
  - Dependencies: TASK-003

- [x] TASK-006 | S | **Create `src/assets/sample.md`**
  - What: Write a sample Markdown document covering: H1/H2 headings, bold, italic, unordered list, ordered list, fenced code block (use `js` — confirmed in `highlight.js/lib/common`), blockquote, inline code, and a horizontal rule. Keep total content under 2 KB (RISK-008).
  - File(s): `src/assets/sample.md`
  - Done when: File exists, is < 2 KB, all fenced language tags are in the `highlight.js/lib/common` language list (audit: `js`, `ts`, `bash`, `json` are all safe)
  - Risk: RISK-003 — only use language tags confirmed in the common subset
  - Dependencies: TASK-001

- [x] TASK-007 | M | **Create `src/utils/markdownUtils.ts`**
  - What: Implement `parseMarkdown(markdown: string): string` exactly as designed in the plan: `Marked` + `markedHighlight` + `hljs` (common import only) + `DOMPurify.sanitize`. Wrap in try/catch returning `''` on error. Add ESLint disable comment on `DOMPurify.sanitize` call explaining the XSS contract.
  - File(s): `src/utils/markdownUtils.ts`
  - Done when: File exports `parseMarkdown`; `npm run typecheck` passes; no full `highlight.js` import present (only `highlight.js/lib/common`)
  - Risk: RISK-001 (confirm marked v9 API works), RISK-004 (no full hljs import), RISK-009 (try/catch in place)
  - Dependencies: TASK-002, TASK-005

- [x] TASK-008 | M | **Create `src/utils/markdownUtils.test.ts` with full coverage**
  - What: Write Vitest unit tests covering all 6 cases from the plan plus a performance benchmark. Tests:
    1. `# Hello` → output contains `<h1>Hello</h1>`
    2. `**bold**` → output contains `<strong>bold</strong>`
    3. Fenced ` ```js ` block → output contains class `hljs`
    4. `<script>alert(1)</script>` → output does NOT contain `<script>`
    5. `''` (empty) → returns `''`
    6. `> quote` → output contains `<blockquote>`
    7. Performance: `parseMarkdown` on a 5,000-word string completes in < 50 ms (`performance.now()` assertion)
  - File(s): `src/utils/markdownUtils.test.ts`
  - Done when: `npm run test` passes all 7 tests; coverage on `markdownUtils.ts` ≥ 80%
  - Risk: RISK-002 (jsdom XSS test is necessary but not sufficient — note manual browser test required in QA), RISK-006 (perf benchmark enforced here)
  - Dependencies: TASK-007

---

### Milestone 3 — Hook

- [x] TASK-009 | S | **Create `src/hooks/useMarkdown.ts`**
  - What: Implement `useMarkdown(markdown: string): string` hook with debounce via `useRef` + `setTimeout`/`clearTimeout`. Initial state is synchronous (`useState(() => parseMarkdown(markdown))`). Cleanup on unmount.
  - File(s): `src/hooks/useMarkdown.ts`
  - Done when: `npm run typecheck` passes; hook imports resolve correctly from `../utils/markdownUtils` and `../config`
  - Dependencies: TASK-007, TASK-005

---

### Milestone 4 — Components

- [x] TASK-010 | S | **Create `src/global.css`**
  - What: Write global CSS with `:root { --breakpoint-mobile: 768px }`, universal box-sizing reset, `html/body/#root { height: 100%; margin: 0 }`, and `body { font-family: system-ui, sans-serif }`. Include comment noting `--breakpoint-mobile` mirrors the `@media` value in `App.module.css`.
  - File(s): `src/global.css`
  - Done when: File exists with all required rules; CSS custom property defined
  - Dependencies: TASK-001

- [x] TASK-011 | S | **Create `Header` component**
  - What: Create `src/components/Header/Header.tsx` rendering a `<header>` with an `<h1>Markdown Editor</h1>`. Create `Header.module.css` with styling: full-width, background colour, padding, border-bottom.
  - File(s): `src/components/Header/Header.tsx`, `src/components/Header/Header.module.css`
  - Done when: Component renders without TypeScript errors; CSS module import resolves; `npm run typecheck` passes
  - Dependencies: TASK-003

- [x] TASK-012 | S | **Create `EditorPane` component**
  - What: Create `src/components/EditorPane/EditorPane.tsx` with a controlled `<textarea>` accepting `value` and `onChange` props. `aria-label="Markdown editor"`, `spellCheck={false}`. CSS Module styles: pane takes 50% width, textarea fills pane height, monospace font, no resize handle, overflow-y auto.
  - File(s): `src/components/EditorPane/EditorPane.tsx`, `src/components/EditorPane/EditorPane.module.css`
  - Done when: Component renders; textarea is monospace; `npm run typecheck` passes; CSS module import present
  - Dependencies: TASK-003

- [x] TASK-013 | S | **Create `PreviewPane` component**
  - What: Create `src/components/PreviewPane/PreviewPane.tsx` accepting `html` and `isEmpty` props. When `isEmpty` is true render `<p className={styles.placeholder}>Nothing to preview</p>`. Otherwise render `<div dangerouslySetInnerHTML={{ __html: html }} />` with an ESLint comment explaining the DOMPurify sanitisation contract. `role="region"` and `aria-label="Preview"` on the outer div. CSS Module: 50% width, overflow-y auto, padding, muted placeholder colour.
  - File(s): `src/components/PreviewPane/PreviewPane.tsx`, `src/components/PreviewPane/PreviewPane.module.css`
  - Done when: Component renders both states; `npm run typecheck` passes; `role="region"` present; CSS module import present
  - Risk: RISK-007 — ESLint comment on `dangerouslySetInnerHTML` must explain sanitisation contract
  - Dependencies: TASK-003

---

### Milestone 5 — Assembly

- [x] TASK-014 | M | **Create `src/App.tsx` and `src/App.module.css`**
  - What: Wire all components in `App.tsx`: state via `useState(sampleContent)`, html via `useMarkdown`, render `<Header>` + split-pane `<main>` with `<EditorPane>` and `<PreviewPane>`. Create `App.module.css` with flex-column layout, `height: 100vh`, and the responsive `@media (max-width: 768px)` rule stacking panes vertically (include `/* matches --breakpoint-mobile */` comment).
  - File(s): `src/App.tsx`, `src/App.module.css`
  - Done when: App renders in `npm run dev`; split pane visible; editor shows sample content; preview renders markdown; `npm run typecheck` passes
  - Dependencies: TASK-006, TASK-009, TASK-011, TASK-012, TASK-013

- [x] TASK-015 | S | **Update `src/main.tsx` and edit `index.html` title**
  - What: Update `src/main.tsx` to import `highlight.js/styles/github.css`, `./global.css`, and `App`. Mount with `StrictMode`. Edit `index.html` `<title>` to `Markdown Editor`.
  - File(s): `src/main.tsx`, `index.html`
  - Done when: Browser tab shows "Markdown Editor"; highlight.js github theme CSS is applied to code blocks; `npm run dev` runs cleanly
  - Dependencies: TASK-010, TASK-014

---

### Milestone 6 — Quality Gates

- [x] TASK-016 | S | **Pass all four quality gates**
  - What: Run `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` in sequence. Fix any errors. Re-measure gzipped bundle size and confirm still < 300 KB.
  - File(s): Any files with errors
  - Done when: All four commands exit 0; gzipped JS < 300 KB confirmed; 0 TypeScript errors; 0 ESLint errors; all tests pass
  - Dependencies: TASK-015, TASK-008

---

## Milestone Map

- **Milestone 1 — Foundation**: TASK-001, TASK-002, TASK-003, TASK-004
- **Milestone 2 — Core Logic**: TASK-005, TASK-006, TASK-007, TASK-008
- **Milestone 3 — Hook**: TASK-009
- **Milestone 4 — Components**: TASK-010, TASK-011, TASK-012, TASK-013
- **Milestone 5 — Assembly**: TASK-014, TASK-015
- **Milestone 6 — Quality Gates**: TASK-016

---

## Definition of Done (Cycle Level)

- [ ] All 16 tasks checked off
- [ ] AC-001: Two equal-width panes with sample content on load
- [ ] AC-002: Preview updates within 150 ms + render after typing
- [ ] AC-003: Fenced `js` code block renders with syntax colouring
- [ ] AC-004: Scrolling one pane does not move the other
- [ ] AC-005: At < 768 px viewport, panes stack vertically
- [ ] AC-006: Browser tab reads "Markdown Editor"
- [ ] AC-007: `npm run typecheck` exits 0
- [ ] AC-008: `npm run lint` exits 0
- [ ] AC-009: `npm run test` passes; ≥ 80% coverage on `markdownUtils`
- [ ] AC-010: `npm run build` gzipped JS < 300 KB
- [ ] AC-011: `<script>alert(1)</script>` does not execute in preview (manual browser test in QA)
- [ ] AC-012: Empty editor shows "Nothing to preview"
- [ ] AC-013: Header bar visible with "Markdown Editor"
- [ ] Quality gates pass (Stage 08 will verify formally)
