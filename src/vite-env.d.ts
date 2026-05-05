/// <reference types="vite/client" />

// File System Access API — not yet in TypeScript's lib.dom.d.ts as a global function
interface FilePickerAcceptType {
  description?: string
  accept: Record<string, string[]>
}
interface OpenFilePickerOptions {
  types?: FilePickerAcceptType[]
  excludeAcceptAllOption?: boolean
  multiple?: boolean
}
declare function showOpenFilePicker(
  options?: OpenFilePickerOptions,
): Promise<FileSystemFileHandle[]>
