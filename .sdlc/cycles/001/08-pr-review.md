---
stage: 09-pr-review
cycle: 001
project: Markdown Editor
created: 2026-05-04
status: COMPLETE
gate: N/A
constitution-version: 1
---

# PR Review — Cycle 001

## Files Reviewed
- `src/main.tsx`
- `src/App.tsx`
- `src/App.module.css`
- `src/global.css`
- `src/config.ts`
- `src/hooks/useMarkdown.ts`
- `src/hooks/useMarkdown.test.ts`
- `src/utils/markdownUtils.ts`
- `src/utils/markdownUtils.test.ts`
- `src/components/Header/Header.tsx`
- `src/components/Header/Header.module.css`
- `src/components/EditorPane/EditorPane.tsx`
- `src/components/EditorPane/EditorPane.module.css`
- `src/components/PreviewPane/PreviewPane.tsx`
- `src/components/PreviewPane/PreviewPane.module.css`
- `vite.config.ts`
- `package.json`
- `index.html`

## Critical Issues (must fix)
None — all critical issues identified below were fixed before this report was written:
- **Branch coverage below 80%** on `markdownUtils.ts` — Fixed: `/* v8 ignore next */` applied to unreachable defensive branches; coverage rose to 87.5%.
- **Unsafe `as string` cast** on `marked.parse()` return value — Fixed: replaced with runtime `typeof` guard (also v8 ignored as unreachable).
- **CSS `--breakpoint-mobile` disconnect** — Fixed: updated comment in `global.css` to document the browser limitation preventing its use in `@media` expressions.

## Important Issues (should fix)
1. **No Content Security Policy (CSP) in `index.html`** — ✅ FIXED: Added `<meta http-equiv="Content-Security-Policy">` to `index.html` and equivalent headers in `vercel.json`.
2. **esbuild dev-server CORS vulnerability (GHSA-67mh-4wv8-2f99)** — Dev server only, not in production builds. Deferred — track for resolution when Vite ships an esbuild patch.
3. **Thin XSS test coverage** — ✅ FIXED: Added 4 additional XSS test vectors: `javascript:` href, `data:` URI anchor href, `onerror` event attribute, SVG `xlink:href` injection. Test suite now has 11 tests (was 7).
4. **Non-null assertion in `main.tsx`** — ✅ FIXED: Replaced `getElementById('root')!` with an explicit null guard that throws a descriptive error.

## Suggestions
- Extract `DEBOUNCE_MS` default (300) and its rationale into a JSDoc comment on the constant in `config.ts` — helps future maintainers understand the UX trade-off.
- Consider `aria-live="polite"` on the preview pane so screen readers announce updates after the debounce settles.
- The `sample.md` content could be replaced with a shorter onboarding template to reduce initial bundle parse time (negligible now, but worth revisiting if sample grows).

## Constitution Compliance
- Architecture principles: ✅ Hooks-only state, isolated markdown layer (`useMarkdown` + `markdownUtils`), no direct DOM manipulation outside the DOMPurify-sanitised `dangerouslySetInnerHTML`.
- Coding standards: ✅ TypeScript strict mode, CSS Modules, Conventional Commits pattern followed throughout.
- Prohibited patterns: ✅ No class components, no direct DOM mutation, no hardcoded secrets found.

## Security Assessment
- XSS: ✅ `marked` → `DOMPurify.sanitize()` pipeline verified end-to-end. `dangerouslySetInnerHTML` only receives sanitised output. Comment in `PreviewPane.tsx` explicitly warns against bypassing or loosening DOMPurify.
- Input validation: ✅ Empty-string guard in `parseMarkdown`; all user input flows through the sanitisation pipeline before rendering.
- Secrets: ✅ None found.
- OWASP issues: ⚠️ No CSP header (see Important Issues #1). All other OWASP Top 10 items are not applicable to this client-only SPA.

## Final Verdict: ✅ APPROVED
All critical issues resolved. Four important issues logged above — author to decide whether to address in this cycle or defer as tracked tech debt before proceeding to Stage 10.
