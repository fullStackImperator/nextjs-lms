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
// import Preview from '@/components/preview'
import {Preview} from '@/components/preview'



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


// Define your form schema using the YooptaValue type
// const formSchema = z.object({
//   descriptionEditor: z.array(YooptaValue),
// })

// Define your form data interface
interface FormData {
  descriptionEditor: YooptaValue[];
}



export const ChapterDescriptionForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const form = useForm({
    defaultValues: {
      descriptionEditor: initialData?.descriptionEditor
        ? typeof initialData.descriptionEditor === 'string'
          ? JSON.parse(initialData.descriptionEditor)
          : initialData.descriptionEditor
        : '',
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: FormData) => {
    try {
      // console.log(values)
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      )
      toast.success('Chapter updated')
      toggleEdit()
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  



  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Kapitel Beschreibung
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit description
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
            <Preview value={initialData?.description!} />
          )}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="descriptionEditor"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {/* <div className="relative">
                      <NoteViewer setContent={setContent} />
                      <Show content={content} />
                    </div> */}
                    <Editor
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
