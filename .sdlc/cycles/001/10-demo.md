---
stage: 11-demo
cycle: 001
project: Markdown Editor
created: 2026-05-05
status: COMPLETE
gate: N/A
constitution-version: 1
---

# Feature Demo — Cycle 001

## What Was Built

A browser-based split-pane Markdown editor where you write raw Markdown on the left and see a live-rendered HTML preview on the right — updating automatically as you type. Fenced code blocks get syntax highlighting via highlight.js, the layout is fully responsive on mobile, and all user-supplied content is sanitised against XSS before rendering.

---

## Demo Script

### Prerequisites
- Node.js installed
- Run `npm install` then `npm run dev` in the project directory
- Open **http://localhost:5173** in Chrome, Firefox, Safari, or Edge

### Steps

1. **Observe the initial load**
   - Expected: two equal-width panes side by side; left pane contains sample Markdown (headings, bold, code blocks, lists, blockquote); right pane shows the fully rendered HTML preview.

2. **Type in the editor**
   - Click anywhere in the left pane and start typing, e.g. `## Hello World`
   - Expected: the preview updates within ~150 ms showing a styled `<h2>Hello World</h2>` — no page reload.

3. **Add a fenced code block**
   - Type the following in the editor:
     ````
     ```js
     const greet = name => `Hello, ${name}!`
     ```
     ````
   - Expected: the preview renders a code block with JavaScript syntax colouring (github theme — keywords in blue/purple, strings in green).

4. **Test independent scrolling**
   - Paste a large block of text (or repeat lines) so both panes overflow
   - Scroll the editor pane; the preview should stay fixed, and vice versa.

5. **Test the empty state**
   - Select all text in the editor (`Cmd/Ctrl+A`) and delete it
   - Expected: the preview shows centred muted text: *"Nothing to preview"*

6. **Test XSS safety**
   - Type `<script>alert(1)</script>` in the editor
   - Expected: no alert dialog; the script tag is stripped from the preview entirely.

7. **Test responsive layout**
   - Open browser DevTools → toggle device emulation → set width to 375 px
   - Expected: panes stack vertically — editor on top, preview below.

### Key Behaviours to Highlight
- **Live debounced preview** — the 150 ms debounce prevents re-renders on every keystroke while still feeling instant.
- **highlight.js common subset** — only the most-used languages are bundled, keeping the gzipped JS at 120 KB (well within the 300 KB budget).
- **DOMPurify + CSP** — two independent layers of XSS defence; neither can be loosened without breaking the other.

---

## Known Limitations
- Tab key in the editor moves browser focus rather than inserting a tab character (intentional MVP trade-off; flagged for a future cycle).
- No file open / save / export in this cycle (delivered in cycle 002).
- No formatting toolbar in this cycle (delivered in cycle 002).
- Component-level tests (Header, EditorPane, PreviewPane, useMarkdown) have 0% coverage; deferred as tech debt.

---

## Acceptance Criteria Status

| AC | Description | Status |
|---|---|---|
| AC-001 | Two equal-width panes with sample content on load | ✅ Met |
| AC-002 | Preview updates within 150 ms + render after typing | ✅ Met |
| AC-003 | Fenced `js` code block renders with syntax colouring | ✅ Met |
| AC-004 | Scrolling one pane does not move the other | ✅ Met |
| AC-005 | At < 768 px viewport, panes stack vertically | ✅ Met |
| AC-006 | Browser tab reads "Markdown Editor" | ✅ Met |
| AC-007 | `npm run typecheck` exits 0 | ✅ Met |
| AC-008 | `npm run lint` exits 0 | ✅ Met |
| AC-009 | All unit tests pass; ≥ 80% coverage on `markdownUtils` | ✅ Met (94.11%) |
| AC-010 | Gzipped JS bundle < 300 KB | ✅ Met (120.73 KB) |
| AC-011 | `<script>alert(1)</script>` does not execute in preview | ✅ Met |
| AC-012 | Empty editor shows "Nothing to preview" | ✅ Met |
| AC-013 | Header bar visible with "Markdown Editor" | ✅ Met |
