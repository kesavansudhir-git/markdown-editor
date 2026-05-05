import { describe, it, expect } from 'vitest'
import { parseMarkdown } from './markdownUtils'

describe('parseMarkdown', () => {
  it('renders heading', () => {
    const result = parseMarkdown('# Hello')
    expect(result).toContain('<h1>Hello</h1>')
  })

  it('renders bold text', () => {
    const result = parseMarkdown('**bold**')
    expect(result).toContain('<strong>bold</strong>')
  })

  it('renders fenced code block with hljs class', () => {
    const result = parseMarkdown('```js\nconst x = 1\n```')
    expect(result).toContain('hljs')
  })

  it('sanitises XSS script injection', () => {
    const result = parseMarkdown('<script>alert(1)</script>')
    expect(result).not.toContain('<script>')
    expect(result).not.toContain('alert(1)')
  })

  it('sanitises javascript: href', () => {
    const result = parseMarkdown('[click](javascript:alert(1))')
    expect(result).not.toContain('javascript:')
  })

  it('sanitises data: URI in anchor href', () => {
    const result = parseMarkdown('[click](data:text/html,<script>alert(1)</script>)')
    expect(result).not.toContain('data:text/html')
  })

  it('sanitises onerror event attribute', () => {
    const result = parseMarkdown('<img src="x" onerror="alert(1)">')
    expect(result).not.toContain('onerror')
  })

  it('sanitises SVG xlink:href injection', () => {
    const result = parseMarkdown('<svg><image xlink:href="javascript:alert(1)"/></svg>')
    expect(result).not.toContain('javascript:')
  })

  it('returns empty string for empty input', () => {
    expect(parseMarkdown('')).toBe('')
    expect(parseMarkdown('   ')).toBe('')
  })

  it('renders blockquote', () => {
    const result = parseMarkdown('> quote')
    expect(result).toContain('<blockquote>')
  })

  it('completes within 50 ms on a large document', () => {
    const words = 'Lorem ipsum dolor sit amet '.repeat(1000)
    const start = performance.now()
    parseMarkdown(words)
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(50)
  })
})
