'use client'

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Course } from '@prisma/client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Combobox } from '@/components/ui/combobox'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'


interface CategoryFormProps {
  initialData: Course
  courseId: string
  options: { label: string; value: string }[]
}

const formSchema = z.object({
  categoryId: z.string().min(1),
})

export const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || '',
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values)
      toast.success('Course updated')
      toggleEdit()
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    }
  }

  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId
  )

  // Submission handler for new category creation
  const handleNewCategorySubmit = async () => {
    try {
      // Send a POST request to the endpoint responsible for creating a new category
      const response = await axios.post('/api/categories', {
        name: newCategoryName,
      })

      // Check if the request was successful
      if (response.status === 200) {
        // Category created successfully
        // toast.success('New category created. Save your selection now.')
        // You may want to refresh the options for the Combobox if needed
        // For example, refetch the list of categories
        // Then, update the options state used in your Combobox
        // Update the categoryId field value in the form
        form.setValue('categoryId', response.data.id)
        // router.refresh()

        // Call the onSubmit function after setting the form value
        onSubmit(form.getValues())

        // router.refresh()
      } else {
        // Handle other status codes or errors
        toast.error('Failed to create category')
      }

      // Clear the new category name input field
      setNewCategoryName('')
    } catch (error) {
      toast.error('Error creating new category')
      console.error('Error creating new category:', error)
      // Handle error cases appropriately
    }
  }



  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Projekt Kategorie
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Kategorie wählen
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.categoryId && 'text-slate-500 italic'
          )}
        >
          {selectedOption?.label || 'Keine Kategorie'}
        </p>
      )}
      {isEditing && (
        <div>
          <div className="text-xs text-muted-foreground mt-4">
            Wählen Sie eine Kategorie für das Projekt oder...
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Combobox
                        options={options}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                      {/* <Combobox options={...options} {...field} /> */}
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
          <Separator className="my-8" />
          <div className="text-xs text-muted-foreground mt-4">
            ...oder erstellen Sie eine neue Kategorie
          </div>
          <div className="flex w-full tems-center space-x-2 mt-4">
            <Input
              type="text"
              placeholder="Neue Kategorie"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button onClick={handleNewCategorySubmit}>Erstellen</Button>
          </div>
        </div>
      )}
    </div>
  )
}
