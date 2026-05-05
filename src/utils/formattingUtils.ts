export type FormatType =
  | 'bold'
  | 'italic'
  | 'inline-code'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'blockquote'
  | 'code-block'
  | 'ul'
  | 'ol'
  | 'link'

export interface FormatResult {
  value: string
  selectionStart: number
  selectionEnd: number
}

function findLineStart(value: string, pos: number): number {
  return value.slice(0, pos).lastIndexOf('\n') + 1
}

function wrapInline(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  marker: string,
  placeholder: string,
): FormatResult {
  const selected = value.slice(selectionStart, selectionEnd) || placeholder
  const wrapped = `${marker}${selected}${marker}`
  return {
    value: value.slice(0, selectionStart) + wrapped + value.slice(selectionEnd),
    selectionStart: selectionStart + marker.length,
    selectionEnd: selectionStart + marker.length + selected.length,
  }
}

function prefixLines(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  getPrefix: (index: number) => string,
): FormatResult {
  const lineStart = findLineStart(value, selectionStart)
  // Expand to the end of the last selected line
  const endPos = selectionEnd > selectionStart ? selectionEnd - 1 : selectionStart
  const tail = value.slice(endPos)
  const nlPos = tail.indexOf('\n')
  const lineEnd = nlPos === -1 ? value.length : endPos + nlPos

  const lines = value.slice(lineStart, lineEnd).split('\n')
  const prefixed = lines.map((l, i) => getPrefix(i) + l).join('\n')

  return {
    value: value.slice(0, lineStart) + prefixed + value.slice(lineEnd),
    selectionStart: lineStart + getPrefix(0).length,
    selectionEnd: lineStart + prefixed.length,
  }
}

function prefixHeading(
  value: string,
  selectionStart: number,
  prefix: string,
): FormatResult {
  const lineStart = findLineStart(value, selectionStart)
  const rest = value.slice(lineStart)
  const nlPos = rest.indexOf('\n')
  const line = nlPos === -1 ? rest : rest.slice(0, nlPos)
  const afterLine = nlPos === -1 ? '' : rest.slice(nlPos)
  const cleanLine = line.replace(/^#{1,6} /, '')
  const newLine = prefix + cleanLine
  return {
    value: value.slice(0, lineStart) + newLine + afterLine,
    selectionStart: lineStart,
    selectionEnd: lineStart + newLine.length,
  }
}

export function applyFormat(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  format: FormatType,
): FormatResult {
  switch (format) {
    case 'bold':
      return wrapInline(value, selectionStart, selectionEnd, '**', 'bold text')
    case 'italic':
      return wrapInline(value, selectionStart, selectionEnd, '*', 'italic text')
    case 'inline-code':
      return wrapInline(value, selectionStart, selectionEnd, '`', 'code')
    case 'h1':
      return prefixHeading(value, selectionStart, '# ')
    case 'h2':
      return prefixHeading(value, selectionStart, '## ')
    case 'h3':
      return prefixHeading(value, selectionStart, '### ')
    case 'blockquote':
      return prefixLines(value, selectionStart, selectionEnd, () => '> ')
    case 'ul':
      return prefixLines(value, selectionStart, selectionEnd, () => '- ')
    case 'ol':
      return prefixLines(value, selectionStart, selectionEnd, (i) => `${i + 1}. `)
    case 'code-block': {
      const selected = value.slice(selectionStart, selectionEnd) || 'code here'
      const wrapped = `\`\`\`\n${selected}\n\`\`\``
      return {
        value: value.slice(0, selectionStart) + wrapped + value.slice(selectionEnd),
        selectionStart: selectionStart + 4,
        selectionEnd: selectionStart + 4 + selected.length,
      }
    }
    case 'link': {
      const text = value.slice(selectionStart, selectionEnd) || 'link text'
      const wrapped = `[${text}](url)`
      return {
        value: value.slice(0, selectionStart) + wrapped + value.slice(selectionEnd),
        // Place cursor on 'url' so user can immediately type the URL
        selectionStart: selectionStart + text.length + 3,
        selectionEnd: selectionStart + text.length + 6,
      }
    }
  }
}
