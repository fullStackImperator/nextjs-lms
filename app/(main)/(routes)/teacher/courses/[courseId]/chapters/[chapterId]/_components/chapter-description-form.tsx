'use client'

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Chapter } from '@prisma/client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

// import { Editor } from '@/components/editor'
// import Editor from '@/components/editor_lexical'
import Editor from '@/components/editor_yopta'
// import NoteViewer from '@/components/editor_lexical'
// import Show from '@/components/show'
import Preview from '@/components/preview'
// import { Preview } from '@/components/preview'

import type { ParagraphElement } from '@yoopta/paragraph'
import type { BlockquoteElement } from '@yoopta/blockquote'
import type { CodeElement } from '@yoopta/code'
import type { EmbedElement } from '@yoopta/embed'
import type { ImageElement } from '@yoopta/image'
import type { LinkElement } from '@yoopta/link'
import type { CalloutElement } from '@yoopta/callout'
import type { VideoElement } from '@yoopta/video'
import type {
  HeadingOneElement,
  HeadingTwoElement,
  HeadingThreeElement,
} from '@yoopta/headings'
import { YooptaValue } from '@/lib/yopta/initialData'



interface ChapterDescriptionFormProps {
  initialData: Chapter
  courseId: string
  chapterId: string
}




export const ChapterDescriptionForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterDescriptionFormProps) => {

  const [isEditing, setIsEditing] = useState(false)
  const [editorContent, setEditorContent] = useState<YooptaValue[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)


  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()



  const onSubmit = async () => {
    try {
      // console.log(values)
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        descriptionEditor: editorContent,
      })
      toast.success('Chapter updated')
      toggleEdit()
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
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
      {!isEditing && (
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
      )}
      {isEditing && (
        <div className="p-2">
          <Editor
            value={initialData?.descriptionEditor! as YooptaValue[]}
            onChange={setEditorContent}
          />
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
