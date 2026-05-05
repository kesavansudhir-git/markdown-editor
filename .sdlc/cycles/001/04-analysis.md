---
stage: 05-analyze
cycle: 001
project: Markdown Editor
created: 2026-05-04
status: COMPLETE
gate: N/A
constitution-version: 1
---

# Risk & Gap Analysis — Cycle 001

## Risk Register

| ID | Description | Probability | Impact | Mitigation |
|---|---|---|---|---|
| RISK-001 | **marked version pinning** — plan uses `new Marked(markedHighlight(...))` (v9 API). If npm resolves a newer major, the constructor pattern and `string` cast may silently break. | Med | High | Pin `"marked": "^9.0.0"` in package.json. Add assertion test that `parseMarkdown('# Hi')` returns a string starting with `<h1>`. |
| RISK-002 | **DOMPurify + jsdom false confidence** — DOMPurify initialises in jsdom but its behaviour diverges from a real browser DOM. XSS tests (AC-011) may pass in Vitest but fail in production browser. | Med | High | Supplement unit tests with a manual browser smoke test for `<script>alert(1)</script>` injection. Don't rely solely on jsdom for security acceptance. |
| RISK-003 | **hljs common subset may omit languages in sample.md** — `highlight.js/lib/common` covers ~35 languages. If sample.md uses a language outside that set, `hljs.getLanguage(lang)` returns `undefined`, AC-003 fails silently. | Med | Med | Audit all fenced code block language tags in `sample.md` against the common language list before commit. |
| RISK-004 | **Bundle size ceiling is tight** — React 18 + marked + marked-highlight + hljs/common + DOMPurify estimated at ~265–275 KB gzipped; a single accidental full hljs import blows the 300 KB budget. | Med | Med | Run `npm run build` immediately after dependency install (before any app code) and measure gzipped size. Add bundle size check to CI. |
| RISK-005 | **CSS breakpoint dual-source** — `--breakpoint-mobile` CSS var can't be used in `@media` expressions; plan relies on a manual comment sync. If one is updated without the other, responsive layout silently breaks. | Low | Med | Co-locate a `/* matches --breakpoint-mobile */` comment on the media query. Consider PostCSS custom-media plugin as a future cycle improvement. |
| RISK-006 | **100 ms re-render NFR is untested** — No benchmark or CI check enforces the latency budget. On large documents or low-end hardware, `marked.parse()` + `DOMPurify.sanitize()` + React reconciliation may exceed it. | Med | Med | Add a `performance.now()` benchmark in `markdownUtils.test.ts` asserting `parseMarkdown` on a 5,000-word document completes in < 50 ms. |
| RISK-007 | **`dangerouslySetInnerHTML` contract** — If DOMPurify options are later loosened (e.g., `FORCE_BODY: true`), XSS becomes a production defect. No lint rule or checklist guards this. | Low | High | Add an ESLint comment on the `dangerouslySetInnerHTML` usage explaining the sanitisation contract. Flag any DOMPurify option changes for security review. |
| RISK-008 | **Synchronous first render** — `useState(() => parseMarkdown(markdown))` blocks initial paint on the main thread if `sample.md` grows large. | Low | Med | Keep `sample.md` under 2 KB. Document this constraint as a comment in the file. |
| RISK-009 | **No error boundary** — `marked.parse()` can throw on pathological input. Without a try/catch or React ErrorBoundary, a runtime exception unmounts the entire app. | Low | High | Wrap `parseMarkdown` in try/catch returning an empty string on error. Add a React `ErrorBoundary` around `PreviewPane`. |
| RISK-010 | **Tab key UX debt** — Tab moves focus out of the editor (browser default). Acceptable for MVP but likely to surface as a bug report. | Low | Low | Document in code comment on `<textarea>` and flag for Cycle 002 retro. |

---

## Dependency Map

```
index.html
  └── src/main.tsx
        ├── react (StrictMode)
        ├── react-dom/client (createRoot)
        ├── highlight.js/styles/github.css   [external]
        ├── src/global.css
        └── src/App.tsx
              ├── react (useState)
              ├── src/assets/sample.md (?raw)
              ├── src/App.module.css
              ├── src/hooks/useMarkdown.ts
              │     ├── react (useState, useEffect, useRef)
              │     ├── src/config.ts
              │     └── src/utils/markdownUtils.ts
              │           ├── marked              [external, pin ^9]
              │           ├── marked-highlight    [external]
              │           ├── highlight.js/lib/common  [external]
              │           └── dompurify           [external]
              ├── src/components/Header/Header.tsx
              │     └── Header.module.css
              ├── src/components/EditorPane/EditorPane.tsx
              │     └── EditorPane.module.css
              └── src/components/PreviewPane/PreviewPane.tsx
                    └── PreviewPane.module.css

Test chain (not in runtime bundle):
  src/utils/markdownUtils.test.ts
    ├── src/utils/markdownUtils.ts
    ├── vitest (globals)
    └── jsdom (env — must be set in vite.config.ts)
```

**No circular dependencies detected.** Graph is a strict DAG.

---

## Plan Gaps

| # | Gap | Severity |
|---|---|---|
| G-01 | `EditorPane.tsx` code snippet omits `import styles from './EditorPane.module.css'` — will throw ReferenceError at runtime | Critical |
| G-02 | `PreviewPane.tsx` code snippet omits `import styles from './PreviewPane.module.css'` — same issue | Critical |
| G-03 | `vite.config.ts` test block does not specify `environment: 'jsdom'` — DOMPurify fails in default Node environment, all sanitisation tests error | Critical |
| G-04 | `App.module.css` has no code snippet — CSS class names (`app`, `main`) and the responsive `@media` rule are unspecified | High |
| G-05 | ESLint dev dependencies (`eslint`, `typescript-eslint`, `eslint-plugin-react-hooks`) missing from install steps | High |
| G-06 | `index.html` sequenced as step 16 (create) but `npm create vite` generates it at step 1 — it only needs a `<title>` edit | Medium |
| G-07 | No try/catch around `parseMarkdown` — runtime exceptions crash the React tree (RISK-009) | High |
| G-08 | `@testing-library/react` installed but no component test file planned for this cycle — dead dependency | Low |

---

## Recommended Plan Amendments

The following are applied to `03-plan.md`:

1. **G-01, G-02** — Add missing CSS Module import statements to `EditorPane.tsx` and `PreviewPane.tsx` code snippets.
2. **G-03** — Add `environment: 'jsdom'` to the Vitest `test` block in `vite.config.ts`.
3. **G-04** — Add `App.module.css` code snippet specifying class names and the responsive rule.
4. **G-05** — Add ESLint packages to step 5 install command.
5. **G-06** — Relabel step 16 as an edit (not create) and note `index.html` exists after step 1.
6. **G-07** — Wrap `parseMarkdown` in try/catch returning `''` on error; note ErrorBoundary as a follow-up.
7. **RISK-001** — Pin `marked` to `^9.0.0` in the package.json dependency list.
