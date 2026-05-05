import { describe, it, expect } from 'vitest'
import { applyFormat } from './formattingUtils'

describe('applyFormat', () => {
  // ── Inline wrappers ──────────────────────────────────────────────
  it('bold: wraps selection', () => {
    const r = applyFormat('Hello World', 6, 11, 'bold')
    expect(r.value).toBe('Hello **World**')
    expect(r.selectionStart).toBe(8)
    expect(r.selectionEnd).toBe(13)
  })

  it('bold: inserts placeholder when no selection', () => {
    const r = applyFormat('Hello ', 6, 6, 'bold')
    expect(r.value).toBe('Hello **bold text**')
    expect(r.selectionStart).toBe(8)
    expect(r.selectionEnd).toBe(17)
  })

  it('italic: wraps selection', () => {
    const r = applyFormat('Hello World', 6, 11, 'italic')
    expect(r.value).toBe('Hello *World*')
  })

  it('inline-code: wraps selection', () => {
    const r = applyFormat('run foo now', 4, 7, 'inline-code')
    expect(r.value).toBe('run `foo` now')
    expect(r.selectionStart).toBe(5)
    expect(r.selectionEnd).toBe(8)
  })

  // ── Headings ─────────────────────────────────────────────────────
  it('h1: prefixes current line', () => {
    const r = applyFormat('Hello World', 5, 5, 'h1')
    expect(r.value).toBe('# Hello World')
  })

  it('h2: prefixes current line in a multiline doc', () => {
    const r = applyFormat('Line1\nLine2\nLine3', 8, 8, 'h2')
    expect(r.value).toBe('Line1\n## Line2\nLine3')
  })

  it('h1: strips existing heading prefix before applying', () => {
    const r = applyFormat('## Hello', 4, 4, 'h1')
    expect(r.value).toBe('# Hello')
  })

  it('h3: replaces h1 prefix', () => {
    const r = applyFormat('# Title', 3, 3, 'h3')
    expect(r.value).toBe('### Title')
  })

  // ── Line-prefix: blockquote ───────────────────────────────────────
  it('blockquote: prefixes current line when no selection', () => {
    const r = applyFormat('Hello World', 5, 5, 'blockquote')
    expect(r.value).toBe('> Hello World')
  })

  it('blockquote: prefixes all selected lines', () => {
    const r = applyFormat('Line1\nLine2\nLine3', 0, 11, 'blockquote')
    expect(r.value).toBe('> Line1\n> Line2\nLine3')
  })

  // ── Line-prefix: lists ────────────────────────────────────────────
  it('ul: prefixes current line', () => {
    const r = applyFormat('item', 2, 2, 'ul')
    expect(r.value).toBe('- item')
  })

  it('ul: prefixes each selected line', () => {
    const r = applyFormat('apple\nbanana\ncherry', 0, 12, 'ul')
    expect(r.value).toBe('- apple\n- banana\ncherry')
  })

  it('ol: prefixes lines with incrementing numbers', () => {
    const r = applyFormat('apple\nbanana', 0, 12, 'ol')
    expect(r.value).toBe('1. apple\n2. banana')
  })

  // ── Block: code block ─────────────────────────────────────────────
  it('code-block: wraps selection in fenced block', () => {
    const r = applyFormat('const x = 1', 0, 11, 'code-block')
    expect(r.value).toBe('```\nconst x = 1\n```')
    expect(r.selectionStart).toBe(4)
    expect(r.selectionEnd).toBe(15)
  })

  it('code-block: inserts placeholder when no selection', () => {
    const r = applyFormat('', 0, 0, 'code-block')
    expect(r.value).toBe('```\ncode here\n```')
  })

  // ── Link ──────────────────────────────────────────────────────────
  it('link: wraps selection as link text, selects url placeholder', () => {
    const r = applyFormat('click here', 6, 10, 'link')
    expect(r.value).toBe('click [here](url)')
    // cursor should land on 'url' for immediate typing
    expect(r.value.slice(r.selectionStart, r.selectionEnd)).toBe('url')
  })

  it('link: inserts placeholder text when no selection', () => {
    const r = applyFormat('', 0, 0, 'link')
    expect(r.value).toBe('[link text](url)')
    expect(r.value.slice(r.selectionStart, r.selectionEnd)).toBe('url')
  })
})
