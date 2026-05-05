import { useState, useRef } from 'react'
import sampleContent from './assets/sample.md?raw'
import Header from './components/Header/Header'
import Toolbar from './components/Toolbar/Toolbar'
import EditorPane from './components/EditorPane/EditorPane'
import PreviewPane from './components/PreviewPane/PreviewPane'
import { useMarkdown } from './hooks/useMarkdown'
import { applyFormat, type FormatType } from './utils/formattingUtils'
import styles from './App.module.css'

const hasFileSystemAccess = 'showOpenFilePicker' in window

function downloadMarkdown(content: string, name: string) {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  // Temporary anchor for download — not a component mutation
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

export default function App() {
  const [markdown, setMarkdown] = useState(sampleContent)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null)
  const html = useMarkdown(markdown)

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleNew() {
    if (markdown.trim().length > 0 && !window.confirm('Discard unsaved changes?')) return
    setMarkdown('')
    setFileName(null)
    setFileHandle(null)
  }

  function handleClose() {
    if (markdown.trim().length > 0 && !window.confirm(`Close "${fileName}" and discard unsaved changes?`)) return
    setMarkdown('')
    setFileName(null)
    setFileHandle(null)
  }

  async function handleOpen() {
    if (hasFileSystemAccess) {
      try {
        const [handle] = await showOpenFilePicker({
          types: [{ description: 'Markdown', accept: { 'text/markdown': ['.md', '.txt'] } }],
          multiple: false,
        })
        const file = await handle.getFile()
        setMarkdown(await file.text())
        setFileName(file.name)
        setFileHandle(handle)
      } catch {
        // User cancelled the picker — do nothing
      }
    } else {
      fileInputRef.current?.click()
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const content = ev.target?.result
      if (typeof content === 'string') {
        setMarkdown(content)
        setFileName(file.name)
        setFileHandle(null)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  async function handleSave() {
    if (fileHandle) {
      try {
        const writable = await fileHandle.createWritable()
        await writable.write(markdown)
        await writable.close()
        return
      } catch {
        // Permission denied or API unavailable — fall through to download
      }
    }
    downloadMarkdown(markdown, fileName ?? 'untitled.md')
  }

  function handleFormat(format: FormatType) {
    const el = editorRef.current
    if (!el) return
    const result = applyFormat(el.value, el.selectionStart, el.selectionEnd, format)
    setMarkdown(result.value)
    // Restore focus and selection after React re-renders the textarea value
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(result.selectionStart, result.selectionEnd)
    })
  }

  return (
    <div className={styles.app}>
      <Header
        fileName={fileName}
        onNew={handleNew}
        onOpen={handleOpen}
        onSave={handleSave}
        onClose={handleClose}
      />
      <Toolbar onFormat={handleFormat} />
      <main className={styles.main}>
        <EditorPane value={markdown} onChange={setMarkdown} editorRef={editorRef} />
        <PreviewPane html={html} isEmpty={markdown.trim().length === 0} />
      </main>
      {!hasFileSystemAccess && (
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.txt"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      )}
    </div>
  )
}
