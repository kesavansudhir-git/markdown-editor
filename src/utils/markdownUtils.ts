import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js/lib/common'
import DOMPurify from 'dompurify'

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

export function parseMarkdown(markdown: string): string {
  if (markdown.trim().length === 0) return ''
  try {
    const raw = marked.parse(markdown)
    /* v8 ignore next */ if (typeof raw !== 'string') return ''
    // DOMPurify sanitises the marked output — do not remove or loosen options
    return DOMPurify.sanitize(raw)
  } /* v8 ignore next */ catch {
    return ''
  }
}
