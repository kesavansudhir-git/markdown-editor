import type { FormatType } from '../../utils/formattingUtils'
import styles from './Toolbar.module.css'

interface ToolbarProps {
  onFormat: (format: FormatType) => void
}

interface ButtonDef {
  format: FormatType
  label: string
  title: string
}

const GROUPS: ButtonDef[][] = [
  [
    { format: 'bold', label: 'B', title: 'Bold' },
    { format: 'italic', label: 'I', title: 'Italic' },
    { format: 'inline-code', label: '`', title: 'Inline code' },
  ],
  [
    { format: 'h1', label: 'H1', title: 'Heading 1' },
    { format: 'h2', label: 'H2', title: 'Heading 2' },
    { format: 'h3', label: 'H3', title: 'Heading 3' },
  ],
  [
    { format: 'blockquote', label: '>', title: 'Blockquote' },
    { format: 'code-block', label: '</>', title: 'Code block' },
    { format: 'ul', label: '•', title: 'Unordered list' },
    { format: 'ol', label: '1.', title: 'Ordered list' },
  ],
  [
    { format: 'link', label: '🔗', title: 'Link' },
  ],
]

export default function Toolbar({ onFormat }: ToolbarProps) {
  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Formatting">
      {GROUPS.map((group, gi) => (
        <span key={gi} className={styles.group}>
          {group.map(({ format, label, title }) => (
            <button
              key={format}
              className={styles.btn}
              title={title}
              aria-label={title}
              onMouseDown={(e) => {
                // Prevent textarea from losing focus before we read its selection
                e.preventDefault()
                onFormat(format)
              }}
            >
              {label}
            </button>
          ))}
        </span>
      ))}
    </div>
  )
}
