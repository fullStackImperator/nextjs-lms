'use client'
import { MutableRefObject } from 'react'
import { memo } from 'react'
// import { EditorDocument } from '@/types'
import type { EditorState, LexicalEditor } from './types'
import dynamic from 'next/dynamic'
import SplashScreen from './splashScreen'
import type { SerializedEditorState } from 'lexical'



export interface EditorDocument {
  id: string
  name: string
  head: string
  data: SerializedEditorState
  createdAt: string | Date
  updatedAt: string | Date
  handle?: string | null
  baseId?: string | null
}



const Editor = dynamic(() => import('./editor/Editor'), {
  ssr: false,
  loading: () => <SplashScreen title="Loading Editor" />,
})

const Container: React.FC<{
  document: EditorDocument
  editorRef?: MutableRefObject<LexicalEditor | null>
  onChange?: (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>
  ) => void
}> = ({ document, editorRef, onChange }) => {
  return (
    <Editor
      initialConfig={{ editorState: JSON.stringify(document.data) }}
      onChange={onChange}
      editorRef={editorRef}
    />
  )
}

export default memo(
  Container,
  (prev, next) => prev.document.id === next.document.id
)
