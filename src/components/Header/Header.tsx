import styles from './Header.module.css'

interface HeaderProps {
  fileName: string | null
  onNew: () => void
  onOpen: () => void
  onSave: () => void
  onClose: () => void
}

export default function Header({ fileName, onNew, onOpen, onSave, onClose }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        Markdown Editor{fileName ? ` — ${fileName}` : ''}
      </h1>
      <nav className={styles.fileMenu} aria-label="File">
        <button className={styles.menuBtn} onClick={onNew} title="New document">
          New
        </button>
        <button className={styles.menuBtn} onClick={onOpen} title="Open .md file">
          Open
        </button>
        <button className={styles.menuBtn} onClick={onSave} title="Save file">
          Save
        </button>
        {fileName && (
          <button className={`${styles.menuBtn} ${styles.closeBtn}`} onClick={onClose} title="Close file">
            Close
          </button>
        )}
      </nav>
    </header>
  )
}
