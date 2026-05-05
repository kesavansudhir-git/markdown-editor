---
stage: 04-plan
cycle: 001
project: Markdown Editor
created: 2026-05-04
status: COMPLETE
gate: PENDING_HUMAN
constitution-version: 1
---

# Implementation Plan — Cycle 001

## Approach Summary

Bootstrap a Vite + React 18 + TypeScript project from scratch. The architecture separates concerns into three layers: (1) a pure utility module (`markdownUtils.ts`) that handles markdown → sanitised HTML conversion using `marked` + `marked-highlight` + `highlight.js` + `DOMPurify`; (2) a `useMarkdown` hook that wraps that utility with debounced React state; and (3) three presentational components (`Header`, `EditorPane`, `PreviewPane`) composed in `App.tsx`. CSS Modules handle scoped styling; a single `global.css` owns the `:root` CSS custom properties and reset.

The key bundle-size risk (highlight.js) is mitigated by importing `highlight.js/lib/common` (top ~35 languages, ~50 KB gzipped) rather than the full build. The responsive breakpoint is defined as `--breakpoint-mobile: 768px` in `:root` as a documented token; the matching media query value is co-located in a CSS comment so a future design system can update both in one pass.

---

## New Files to Create

| File path | Purpose |
|---|---|
| `package.json` | Project manifest — deps, scripts |
| `index.html` | Vite entry — sets `<title>Markdown Editor</title>` |
| `vite.config.ts` | Vite config — Vitest config block included |
| `tsconfig.json` | TypeScript config — strict mode |
| `tsconfig.node.json` | TS config for Vite config file itself |
| `eslint.config.js` | ESLint flat config — typescript-eslint + react-hooks |
| `src/main.tsx` | React root mount — imports `global.css` and hljs theme |
| `src/App.tsx` | Root component — owns `markdown` state, wires layout |
| `src/App.module.css` | App-level layout (flex column, split pane row) |
| `src/global.css` | `:root` CSS custom properties + box-sizing reset |
| `src/config.ts` | Exports `DEBOUNCE_MS = 150` |
| `src/assets/sample.md` | Sample markdown document (imported via `?raw`) |
| `src/utils/markdownUtils.ts` | Pure `parseMarkdown(md: string): string` function |
| `src/utils/markdownUtils.test.ts` | Vitest unit tests for `markdownUtils` |
| `src/hooks/useMarkdown.ts` | Debounced hook: `useMarkdown(markdown: string): string` |
| `src/components/Header/Header.tsx` | `<header>` with `<h1>Markdown Editor</h1>` |
| `src/components/Header/Header.module.css` | Header bar styling |
| `src/components/EditorPane/EditorPane.tsx` | Controlled `<textarea>` with monospace font |
| `src/components/EditorPane/EditorPane.module.css` | Editor pane styling |
| `src/components/PreviewPane/PreviewPane.tsx` | Rendered HTML output + empty state placeholder |
| `src/components/PreviewPane/PreviewPane.module.css` | Preview pane styling + placeholder style |

---

## Files to Modify

None — greenfield project.

---

## Component / Function Design

### `src/config.ts`
```ts
export const DEBOUNCE_MS = 150;
```

---

### `src/utils/markdownUtils.ts`
```ts
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/common';
import DOMPurify from 'dompurify';

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  })
);

export function parseMarkdown(markdown: string): string {
  try {
    const raw = marked.parse(markdown) as string;
    return DOMPurify.sanitize(raw);
  } catch {
    return '';
  }
}
```
- **Inputs**: raw markdown string
- **Output**: sanitised HTML string
- **No side effects** — pure function, fully unit-testable without React

---

### `src/hooks/useMarkdown.ts`
```ts
import { useState, useEffect, useRef } from 'react';
import { parseMarkdown } from '../utils/markdownUtils';
import { DEBOUNCE_MS } from '../config';

export function useMarkdown(markdown: string): string {
  const [html, setHtml] = useState(() => parseMarkdown(markdown));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setHtml(parseMarkdown(markdown)), DEBOUNCE_MS);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [markdown]);

  return html;
}
```
- **Inputs**: raw markdown string (from App state)
- **Output**: debounced sanitised HTML string
- Initial render is synchronous (no flash of empty preview)

---

### `src/App.tsx`
```tsx
import { useState } from 'react';
import sampleContent from './assets/sample.md?raw';
import Header from './components/Header/Header';
import EditorPane from './components/EditorPane/EditorPane';
import PreviewPane from './components/PreviewPane/PreviewPane';
import { useMarkdown } from './hooks/useMarkdown';
import styles from './App.module.css';

export default function App() {
  const [markdown, setMarkdown] = useState(sampleContent);
  const html = useMarkdown(markdown);
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <EditorPane value={markdown} onChange={setMarkdown} />
        <PreviewPane html={html} isEmpty={markdown.trim().length === 0} />
      </main>
    </div>
  );
}
```

---

### `src/components/Header/Header.tsx`
```tsx
import styles from './Header.module.css';
export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Markdown Editor</h1>
    </header>
  );
}
```

---

### `src/components/EditorPane/EditorPane.tsx`
```tsx
import styles from './EditorPane.module.css';

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
}
export default function EditorPane({ value, onChange }: EditorPaneProps) {
  return (
    <div className={styles.pane}>
      <textarea
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Markdown editor"
        spellCheck={false}
      />
    </div>
  );
}
```

---

### `src/components/PreviewPane/PreviewPane.tsx`
```tsx
import styles from './PreviewPane.module.css';

interface PreviewPaneProps {
  html: string;
  isEmpty: boolean;
}
export default function PreviewPane({ html, isEmpty }: PreviewPaneProps) {
  return (
    <div className={styles.pane} role="region" aria-label="Preview">
      {isEmpty
        ? <p className={styles.placeholder}>Nothing to preview</p>
        : <div className={styles.content} dangerouslySetInnerHTML={{ __html: html }} />
      }
    </div>
  );
}
```

---

### `src/App.module.css`
```css
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* matches --breakpoint-mobile in global.css */
@media (max-width: 768px) {
  .main {
    flex-direction: column;
  }
}
```

---

### `src/global.css`
```css
/* --breakpoint-mobile mirrors the @media value below — update both together */
:root {
  --breakpoint-mobile: 768px;
}
*, *::before, *::after { box-sizing: border-box; }
html, body, #root { height: 100%; margin: 0; }
body { font-family: system-ui, sans-serif; }
```

---

### `src/main.tsx`
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'highlight.js/styles/github.css';
import './global.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>
);
```

---

### `src/utils/markdownUtils.test.ts` (key test cases)
| Test | What it verifies |
|---|---|
| Renders heading | `# Hello` → `<h1>Hello</h1>` |
| Renders bold | `**bold**` → `<strong>bold</strong>` |
| Renders fenced code block | ` ```js\nconst x=1\n``` ` → contains `hljs` class |
| Sanitises XSS | `<script>alert(1)</script>` → no `<script>` in output |
| Empty string | `''` → `''` |
| Blockquote | `> quote` → `<blockquote>` |

---

## Dependencies and Sequencing

1. **Scaffold** — `npm create vite@latest . -- --template react-ts`. Cleans up boilerplate (`src/App.css`, `src/assets/react.svg`, default `App.tsx` content).
2. **Install runtime deps** — `npm install marked@^9.0.0 marked-highlight highlight.js dompurify`
3. **Install type + lint deps** — `npm install -D @types/dompurify eslint typescript-eslint eslint-plugin-react-hooks`
4. **Install test deps** — `npm install -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom`
5. **Configure Vite + Vitest** — add `test` block to `vite.config.ts` with `environment: 'jsdom'` (required for DOMPurify); add `typecheck`, `lint`, `test` scripts to `package.json`
6. **`src/config.ts`** — no dependencies
7. **`src/assets/sample.md`** — no dependencies; content covers all Markdown elements needed by AC-003
8. **`src/utils/markdownUtils.ts` + tests** — depends on deps being installed; run tests to verify coverage
9. **`src/hooks/useMarkdown.ts`** — depends on `markdownUtils` and `config`
10. **`src/global.css`** — no dependencies
11. **`Header` component** — no dependencies beyond CSS Modules
12. **`EditorPane` component** — no dependencies beyond CSS Modules
13. **`PreviewPane` component** — no dependencies beyond CSS Modules
14. **`src/App.tsx` + `App.module.css`** — depends on all three components + `useMarkdown`
15. **`src/main.tsx`** — imports highlight.js CSS + global.css + App
16. **`index.html`** — edit `<title>` tag (generated by scaffold at step 1) to read `Markdown Editor`
17. **Quality gates** — run all four commands, verify pass

---

## Reused Existing Code

None — greenfield project. No existing code to reuse.

---

## CSS Note on Configurable Breakpoint

CSS custom properties cannot be used inside `@media` query expressions (a known CSS limitation). The approach:
- `--breakpoint-mobile: 768px` is defined in `:root` as a documented token for future JS/design-system use
- The matching `@media (max-width: 768px)` in `App.module.css` carries a co-located comment: `/* matches --breakpoint-mobile */`
- A future design system update requires changing the value in both places — the comment makes this discoverable

---

## Estimated Complexity

- **Overall**: M
- **Most complex part**: `markdownUtils.ts` — wiring `marked` v9+ with `marked-highlight` + `highlight.js` + `DOMPurify` correctly, and keeping the bundle under 300 KB gzipped by using `highlight.js/lib/common` (not the full build). This is the part most likely to surface unexpected behaviour during QA (see clarify risks).

---

## Human Gate
PENDING_HUMAN — Awaiting approval before implementation begins.
