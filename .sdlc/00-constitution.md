# Project Constitution — Markdown Editor

Constitution version: 2
Last amended: 2026-05-06

---

## 1. Project Overview

| Field | Value |
|---|---|
| **Project name** | Markdown Editor |
| **Description** | A browser-based application for editing and previewing Markdown files with real-time rendering. |
| **Tech stack** | React 18, Vite, TypeScript, marked, highlight.js, CSS Modules |
| **Target environment** | Browser (modern evergreen: Chrome, Firefox, Safari, Edge) |
| **Deployment model** | Vercel (zero-config SPA, automatic preview deployments per PR) |
| **Repository path** | /Users/sudhirkesavan/Apps/Markdown App |
| **Main branch** | `main` |

---

## 2. Architecture Principles

1. **Hooks-only state** — All UI state is managed through React hooks. No class components anywhere in the codebase.
2. **Isolated markdown layer** — Markdown parsing and rendering live in a dedicated `useMarkdown` hook and a `markdownUtils` module. No parsing logic in UI components.
3. **No direct DOM manipulation** — All DOM interaction happens through React's rendering cycle. Direct `document.*` / `element.*` calls are prohibited outside of explicitly sanctioned refs.

---

## 3. Branch & Commit Standards

| Field | Value |
|---|---|
| **Branch naming** | `feature/<slug>` (e.g., `feature/live-preview`, `feature/file-open`) |
| **Commit convention** | Conventional Commits — `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, `style:` |
| **PR size limit** | 400 lines changed |
| **Required reviewers** | Author self-review (solo project) |

### Commit examples
```
feat: add split-pane live preview
fix: resolve highlight.js language detection for fenced code blocks
chore: configure Vercel deployment settings
refactor: extract markdown parsing into useMarkdown hook
```

---

## 4. Quality Gates

All of the following commands **must pass** before any merge to `main`.

```bash
npm run typecheck   # tsc --noEmit — zero TypeScript errors
npm run lint        # ESLint — zero errors, warnings allowed
npm run test        # Vitest — all unit tests pass
npm run build       # vite build — production bundle succeeds
```

### Test standards

| Type | Required | Coverage target | Location |
|---|---|---|---|
| Unit | Yes | 80% | Colocated with source (`*.test.ts`) |
| Integration | Encouraged | — | `src/__tests__/` |

---

## 5. Code Style

- **CSS naming**: kebab-case (CSS Modules — `editor-pane`, `preview-pane`)
- **Import order**: external packages → internal modules (`@/`) → relative imports
- **No default exports** for utility modules; default exports are fine for React components
- **File naming**: PascalCase for components (`MarkdownEditor.tsx`), camelCase for utilities (`markdownUtils.ts`)

---

## 6. Prohibited Patterns

| Pattern | Reason |
|---|---|
| Hardcoded secrets or API keys | Security |
| Direct DOM mutation outside sanctioned refs | Violates architecture principle #3 |
| `any` type in TypeScript | Defeats type safety |
| Inline styles in JSX | Use CSS Modules instead |
| Parsing markdown in UI components | Violates architecture principle #2 |

---

## 7. Performance Budget

| Metric | Target |
|---|---|
| JS bundle (gzipped) | < 300 KB |
| Initial paint (local dev) | < 500 ms |
| Live preview re-render latency | < 100 ms after keystroke |

---

## 8. SDLC Pipeline

### Cycle naming
Cycles are numbered sequentially: `001`, `002`, `003`, … — one cycle per feature or bug fix.

### Stages
| Stage | Name | Human gate? |
|---|---|---|
| 01 | Constitution | — |
| 02 | Specify | — |
| 03 | Clarify | Yes |
| 04 | Plan | Yes |
| 05 | Analyze | — |
| 05b | UI/UX Validation | — |
| 06 | Tasks | — |
| 07 | Implement | — |
| 08 | Quality Gates | Yes |
| 09 | PR Review | — |
| 10 | QA | Yes |
| 11 | Demo | — |
| 12 | Retro | — |

### UI/UX Validation (Stage 05b)
Mandatory between Analyze and Tasks. Produces ASCII wireframes for all screens/states and walks the complete user journey (open → use → exit). Any interactions not covered by the spec must be added as spec amendments before tasks are written. Introduced in cycle 001 retro after missing File/Edit/Close operations were caught post-implementation.

### Gate approver
Project owner (sudhir.kesavan@citiustech.com)

---

## 9. Amendment Log

| Version | Date | Summary |
|---|---|---|
| 1 | 2026-05-04 | Initial constitution — project onboarded |
| 2 | 2026-05-06 | Added Stage 05b (UI/UX Validation) between Analyze and Tasks; added mandatory user journey walkthrough to Stage 03 (Clarify). Prompted by cycle 001 retro — File/Open/Close operations missed due to no upfront UX journey modelling. |
