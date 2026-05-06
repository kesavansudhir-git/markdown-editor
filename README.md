# Markdown Editor

A browser-based split-pane Markdown editor with live HTML preview, syntax highlighting, file management, and a formatting toolbar.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Tests-28%20passing-4caf50?logo=vitest&logoColor=white)

---

## Features

### Editor
- Split-pane layout — editor on the left, live preview on the right
- Debounced preview rendering (150 ms) — smooth updates without flicker
- Monospace editor with independent scrolling on each pane
- Loads with sample Markdown content on first open
- Responsive layout — stacks vertically on mobile (< 768 px)

### Formatting Toolbar
One-click formatting that wraps or prefixes selected text:

| Button | Inserts |
|---|---|
| **B** | `**bold text**` |
| *I* | `*italic text*` |
| `` ` `` | `` `inline code` `` |
| H1 / H2 / H3 | `# ` / `## ` / `### ` heading prefix |
| `>` | `> ` blockquote prefix |
| `</>` | Fenced code block |
| `•` | `- ` unordered list prefix |
| `1.` | `1. ` ordered list prefix |
| 🔗 | `[text](url)` link |

### File Management
| Action | Behaviour |
|---|---|
| **New** | Clears the editor (prompts if unsaved content exists) |
| **Open** | Opens a local `.md` or `.txt` file |
| **Save** | Writes back to the original file (Chrome/Edge via File System Access API; downloads on Firefox) |
| **Close** | Closes the current file and clears the editor |

### Security
- All rendered HTML is sanitised with **DOMPurify** before injection — XSS safe
- Content Security Policy meta tag + Vercel response headers for defence-in-depth

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Markdown parsing | marked v9 + marked-highlight |
| Syntax highlighting | highlight.js (common subset, github theme) |
| HTML sanitisation | DOMPurify |
| Styling | CSS Modules |
| Testing | Vitest + jsdom |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+

### Install and run
```bash
npm install
npm run dev
```
Open **http://localhost:5173**.

### Available scripts
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build locally
npm run typecheck    # TypeScript type check
npm run lint         # ESLint
npm run test         # Run tests with coverage
```

### Production build
```bash
npm run build
```
Output is in `dist/`. Gzipped JS bundle: ~122 KB (budget: 300 KB).

---

## Project Structure

```
src/
├── assets/
│   └── sample.md              # Default editor content
├── components/
│   ├── EditorPane/            # Controlled textarea
│   ├── Header/                # App title + File menu
│   ├── PreviewPane/           # Sanitised HTML preview
│   └── Toolbar/               # Formatting buttons
├── hooks/
│   └── useMarkdown.ts         # Debounced markdown → HTML hook
├── utils/
│   ├── markdownUtils.ts       # marked + DOMPurify pipeline
│   └── formattingUtils.ts     # Pure text formatting utility
├── App.tsx                    # Root component + file handlers
└── config.ts                  # DEBOUNCE_MS constant
```

---

## Development Process

This project was built using an AI-assisted SDLC framework — a 13-stage pipeline (Specify → Clarify → Plan → Analyze → UI Validation → Tasks → Implement → Quality Gates → PR Review → QA → Demo → Retro) with human approval gates at key stages.

All pipeline artifacts are in `.sdlc/` — specs, plans, risk analysis, QA reports, and retros for each development cycle.

---

## License

MIT
