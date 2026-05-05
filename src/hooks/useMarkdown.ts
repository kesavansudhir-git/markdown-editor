import { useState, useEffect, useRef } from 'react'
import { parseMarkdown } from '../utils/markdownUtils'
import { DEBOUNCE_MS } from '../config'

export function useMarkdown(markdown: string): string {
  const [html, setHtml] = useState(() => parseMarkdown(markdown))
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setHtml(parseMarkdown(markdown)), DEBOUNCE_MS)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [markdown])

  return html
}
