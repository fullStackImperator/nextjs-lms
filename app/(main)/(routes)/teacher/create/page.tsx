'use client'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { addCourse } from './_actions/course'

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Titel ist erforderlich',
  }),
})

const CreatePage = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // const response = await axios.post('/api/courses', values)
      const response = await addCourse(values)
      if (response && response.id) {
        toast.success('Course created')
        router.push(`/teacher/courses/${response.id}`)
      } else {
        throw new Error('Invalid response')
      }
    } catch {
      toast.error('Something went wrong in creating course')
    }
  }


  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Geben Sie ein Projekttitel an</h1>
        <p className="text-sm text-slate-600">
          Wie möchten Sie das Projekt nennen? Keine Sorge, Sie können den Titel
          später anpassen.
        </p>
        <Form {...form}>
          <form
            action=""
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projekt Titel</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="z.B. 'Pokemon aus dem 3D Drucker'"
                      {...field} // passes onChange.. onBlur name etc
                    />
                  </FormControl>
                  {/* <FormDescription>
                    Was soll in dem Projekt gelehrt werden?
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/dashboard">
                <Button type="button" variant="ghost">
                  Zurück
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Weiter
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreatePage
