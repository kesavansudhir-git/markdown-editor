import type { RefObject } from 'react'
import styles from './EditorPane.module.css'

interface EditorPaneProps {
  value: string
  onChange: (value: string) => void
  editorRef: RefObject<HTMLTextAreaElement>
}

export default function EditorPane({ value, onChange, editorRef }: EditorPaneProps) {
  return (
    <div className={styles.pane}>
      {/* Tab key uses default browser behaviour (moves focus) — intentional MVP trade-off */}
      <textarea
        ref={editorRef}
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Markdown editor"
        spellCheck={false}
      />
    </div>
  )
}
