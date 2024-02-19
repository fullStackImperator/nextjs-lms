'use client'

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Course } from '@prisma/client'

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
import { Textarea } from '@/components/ui/textarea'

interface KompetenzenFormProps {
  initialData: Course
  courseId: string
}

const formSchema = z.object({
  kompetenzen: z.string().min(1, {
    message: 'Benötigte Materialien sind notwendig',
  }),
})

export const KompetenzenForm = ({ initialData, courseId }: KompetenzenFormProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kompetenzen: initialData?.kompetenzen || '',
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values)
      toast.success('Projekt aktualisiert')
      toggleEdit()
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Zu erwerbende Kompetenzen
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Zurück</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Zu erwerbende Kompetenzen bearbeiten
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.kompetenzen && 'text-slate-500 italic'
          )}
        >
          {initialData.kompetenzen || 'Keine Kompetenzen werden erworben'}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="kompetenzen"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="z.B. 'Technische Lösungen planen, entwerfen, fertigen, optimieren, prüfen und testen'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Speichern
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
