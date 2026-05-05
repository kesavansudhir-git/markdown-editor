import styles from './PreviewPane.module.css'

interface PreviewPaneProps {
  html: string
  isEmpty: boolean
}

export default function PreviewPane({ html, isEmpty }: PreviewPaneProps) {
  return (
    <div className={styles.pane} role="region" aria-label="Preview">
      {isEmpty ? (
        <p className={styles.placeholder}>Nothing to preview</p>
      ) : (
        // html is sanitised by DOMPurify in markdownUtils — do not bypass or loosen
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  )
}
