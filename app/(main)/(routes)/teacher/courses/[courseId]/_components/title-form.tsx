'use client'

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

interface TitleFormProps {
  initialData: {
    title: string
  }
  courseId: string
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
})

export const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        await axios.patch(`/api/courses/${courseId}`, values)
        toast.success("Projekt aktualisiert")
        toggleEdit()
        router.refresh()
    } catch (error) {
        toast.error("Something went wrong")
    }
  }

    // const onSubmit = async (values: z.infer<typeof formSchema>) => {
    //   try {
    //     // const response = await axios.post('/api/courses', values)
    //     const response = await addCourse(values)
    //     if (response && response.id) {
    //       toast.success('Course created')
    //       router.push(`/teacher/courses/${response.id}`)
    //     } else {
    //       throw new Error('Invalid response')
    //     }
    //   } catch {
    //     toast.error('Something went wrong in creating course')
    //   }
    // }

    
  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Projekt Titel
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Titel eingeben
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Fortgeschrittenes makerspace Projekt'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
                <Button
                    disabled={!isValid || isSubmitting}
                    type="submit"
                >
                    Speichern
                </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
