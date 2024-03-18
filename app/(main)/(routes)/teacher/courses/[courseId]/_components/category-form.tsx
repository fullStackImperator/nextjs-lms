'use client'

import * as React from 'react'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Pencil, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Course } from '@prisma/client'

import { cn } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import { Command as CommandPrimitive } from 'cmdk'

type Options = Record<'label' | 'value', string>

interface Category {
  id: string
  name: string
}

interface CategoryFormProps {
  initialData: Course & { categories: Category[] } // Include categoryIds directly in the Course type
  // initialData: Course & { categories?: string[] } // Include categoryIds directly in the Course type
  courseId: string
  options: { label: string; value: string }[]
}

const formSchema = z.object({
  categories: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
})

export const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [allOptions, setAllOptions] = useState(options)

  //
  //  START MULTI SELECT
  //

  // multi select
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  // const [selected, setSelected] = useState<Options[]>([options[0]])
  const [selected, setSelected] = useState<Options[]>(
    initialData.categories.map((category) => ({
      label: category.name,
      value: category.id,
    }))
  )
  const [inputValue, setInputValue] = useState('')

  const handleUnselect = React.useCallback((options: Options) => {
    setSelected((prev) => prev.filter((s) => s.value !== options.value))
  }, [])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            setSelected((prev) => {
              const newSelected = [...prev]
              newSelected.pop()
              return newSelected
            })
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === 'Escape') {
          input.blur()
        }
      }
    },
    []
  )

  // const selectables = options.filter((options) => !selected.includes(options))
  const selectables = allOptions.filter(
    (option) => !selected.some((sel) => sel.value === option.value)
  )

  //
  //  END MULTI SELECT
  //

  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: initialData.categories,
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Update the 'categories' field in the form data with the selected categories
      values.categories = selected.map((option) => ({
        id: option.value,
        name: option.label,
      }))
      console.log('values of form: ', values)

      await axios.patch(`/api/courses/${courseId}/categories`, values)
      toast.success('Course updated')
      toggleEdit()
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    }
  }

  // const selectedOption = options.find(
  //   (option) => option.value === initialData.categoryId
  // )

  // Submission handler for new category creation
  const handleNewCategorySubmit = async (trimmedValue: string) => {
    try {
      // Send a POST request to the endpoint responsible for creating a new category
      const response = await axios.post('/api/categories', {
        name: trimmedValue,
      })

      // Check if the request was successful
      if (response.status === 200) {
        // Category created successfully
        toast.success('New category created')
        // Update the options state with the new category
        const newCategory = { label: trimmedValue, value: response.data.id }
        setAllOptions((prevOptions) => [...prevOptions, newCategory])
        // Add the new category to the selectables
        setSelected((prevSelected) => [...prevSelected, newCategory])
      } else {
        // Handle other status codes or errors
        toast.error('Failed to create category')
      } 

      // Clear the new category name input field
      setInputValue('')
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
            !initialData.categories?.length && 'text-slate-500 italic'
          )}
        >
          {initialData.categories
            ?.map((category) => {
              const option = options.find((opt) => opt.value === category.id)
              return option ? option.label : null
            })
            .filter((label) => label !== null)
            .join(', ') || 'Keine Kategorie'}
        </p>
      )}
      {isEditing && (
        <div>
          <div className="text-xs text-muted-foreground mt-4">
            Wählen Sie eine Kategorie für das Projekt
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Command
                        onKeyDown={handleKeyDown}
                        className="overflow-visible bg-transparent "
                      >
                        <div className="bg-white group border border-input px-3 py-3 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                          <div className="flex gap-1 flex-wrap">
                            {selected.map((options) => {
                              return (
                                <Badge key={options.value} variant="secondary">
                                  {options.label}
                                  <button
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleUnselect(options)
                                      }
                                    }}
                                    onMouseDown={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                    }}
                                    onClick={() => handleUnselect(options)}
                                  >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                  </button>
                                </Badge>
                              )
                            })}
                            {/* Avoid having the "Search" Icon */}
                            <CommandPrimitive.Input
                              ref={inputRef}
                              value={inputValue}
                              onValueChange={setInputValue}
                              // onChange={handleInputChange} // Add this line to handle input changes
                              onBlur={() => setOpen(false)} // Close the command field
                              onFocus={() => setOpen(true)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault() // Prevent form submission
                                  const trimmedValue = inputValue.trim()
                                  if (trimmedValue !== '') {
                                    setNewCategoryName(trimmedValue) // Set the new category name
                                    handleNewCategorySubmit(trimmedValue) // Submit the new category
                                  }
                                  setInputValue('') // Clear the input field
                                }
                              }}
                              placeholder="Kategorien wählen oder neue Kategorie erstellen und mit Enter bestätigen..."
                              className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
                            />
                          </div>
                        </div>
                        <div className="relative mt-2">
                          {open && selectables.length > 0 ? (
                            <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                              <CommandGroup className="h-full overflow-auto">
                                {selectables.map((option) => {
                                  return (
                                    <CommandItem
                                      key={option.value}
                                      onMouseDown={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                      }}
                                      onSelect={(value) => {
                                        setInputValue('')
                                        setSelected((prev) => [...prev, option])
                                      }}
                                      className={'cursor-pointer'}
                                    >
                                      {option.label}
                                    </CommandItem>
                                  )
                                })}
                              </CommandGroup>
                            </div>
                          ) : null}
                        </div>
                      </Command>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button disabled={isSubmitting} type="submit">
                  {/* <Button disabled={!isValid || isSubmitting} type="submit"> */}
                  Speichern
                </Button>
              </div>
            </form>
          </Form>
          {/* <Separator className="my-8" />
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
          </div> */}
        </div>
      )}
    </div>
  )
}
