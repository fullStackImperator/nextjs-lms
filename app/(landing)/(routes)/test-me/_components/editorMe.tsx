'use client'

import axios from 'axios'
import { MutableRefObject, useState } from 'react'
import { memo } from 'react'
// import { EditorDocument } from '@/types'
import type { EditorState, LexicalEditor } from './types'
import dynamic from 'next/dynamic'
import SplashScreen from './splashScreen'
import type { SerializedEditorState } from 'lexical'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'

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
  const [editorState, setEditorState] = useState<EditorState>()

  // Handle onChange event from the plugin
  function onEditorChange(editorState: EditorState) {
    // setEditorState(editorState)

    // Call toJSON on the EditorState object, which produces a serialization safe string
    // const editorStateJSON = editorState.toJSON()
    // However, we still have a JavaScript object, so we need to convert it to an actual string with JSON.stringify
    setEditorState(editorState)
    // setEditorState(editorStateJSON)
    // setEditorState(JSON.stringify(editorStateJSON))
  }


  console.log('editorState: ', editorState)

  // Handle save to database
  // const handleSaveToDatabase = async () => {
  //   try {
  //     const response = await axios.post('/api/matheditor', document)
  //     if (response.status === 200) {
  //       console.log('Document saved to database successfully')
  //     } else {
  //       console.error('Failed to save document:', response.statusText)
  //     }
  //   } catch (error) {
  //     console.error('Error saving document:', error)
  //   }
  // }

  // Handle save to database
  const handleSaveToDatabase = async () => {
    try {
      const response = await axios.post('/api/matheditor', {
        ...document,
        data: editorState, // Pass serialized state to the backend
      })
      if (response.status === 200) {
        console.log('Document saved to database successfully')
      } else {
        console.error('Failed to save document:', response.statusText)
      }
    } catch (error) {
      console.error('Error saving document:', error)
    }
  }

  return (
    <>
      <Editor
        // initialConfig={{ editorState: JSON.stringify(editorState) }}
        initialConfig={{ editorState: JSON.stringify(document.data) }}
        onChange={onEditorChange}
        editorRef={editorRef}
      />
      <Button onClick={handleSaveToDatabase}>Save to Database</Button>
    </>
  )
}

export default memo(
  Container,
  (prev, next) => prev.document.id === next.document.id
)
