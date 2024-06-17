'use client'

import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Chapter } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'

import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'


// LEXICAL EDITOR
import Editor from './editorMe'
import playgroundTemplate from '@/templates/Playground.json'
import type { SerializedEditorState } from 'lexical'

interface ChapterEditorFormProps {
  initialData: Chapter
  courseId: string
  chapterId: string
}



interface EditorDocument {
  id: string
  name: string
  head: string
  data: SerializedEditorState
  createdAt: string | Date
  updatedAt: string | Date
  handle?: string | null
  baseId?: string | null
}

const document = playgroundTemplate as unknown as EditorDocument

export const ChapterEditorForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterEditorFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editorContent, setEditorContent] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const onSubmit = async () => {
    try {
      // console.log(values)
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        descriptionEditor: editorContent,
      })
      toast.success('Kapitel aktualisiert')
      toggleEdit()
      router.refresh()
    } catch (error) {
      toast.error('Etwas ist schief gelaufen')
    } finally {
      setIsSubmitting(false) // Set submitting state to false after submission completes
    }
  }

  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <p className="text-xl">Kapitel Inhalt</p>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <p className="text-xl">Zurück</p>
          ) : (
            <>
              <Pencil className="h-6 w-6 mr-2" />
              <p className="text-xl">Inhalt bearbeiten</p>
            </>
          )}
        </Button>
      </div>
      {/* {!isEditing && (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.descriptionEditor && 'text-slate-500 italic'
          )}
        >
          {!initialData.descriptionEditor && 'No description'}
          {initialData.descriptionEditor && (
            <Preview value={initialData?.descriptionEditor! as YooptaValue[]} />
          )}
        </div>
      )} */}
      {isEditing && (
        <div className="p-2 bg-white">
          <Editor document={document} />
          <div className="flex items-center gap-x-2">
            <Button onClick={onSubmit} disabled={isSubmitting} className="mt-4">
              {isSubmitting ? 'Submitting...' : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
