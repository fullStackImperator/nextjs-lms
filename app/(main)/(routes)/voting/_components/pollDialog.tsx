'use client'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import toast from 'react-hot-toast'

import { FileUpload } from '@/components/file-upload'

import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

import { mutate } from 'swr'

const formSchema = z.object({
  question: z.string().min(1, {
    message: 'Ein Frage ist für die Umfrage erforderlich',
  }),
  options: z.array(
    z.object({
      title: z.string().min(1, {
        message: 'Option ist erforderlich',
      }),
      votes: z.number().default(0), // Set default value for votes
      color: z.string(), // Optionally validate color format
    })
  ),
})

type Poll = {
  id: string
  question: string
  options: VoteType[]
}

type VoteType = {
  title: string
  votes: number
  color: string
}

type PollDialogProps = {
  open: boolean
  onClose: () => void
  pollData?: Poll
  mode: 'create' | 'edit'
}

const PollDialog = ({ open, onClose, pollData, mode }: PollDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  // console.log('badgeData:', badgeData)
  // console.log('mode:', mode)

  const router = useRouter()

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    question: mode === 'edit' ? pollData?.question : '', // Set default question based on mode
    options: mode === 'edit' ? pollData?.options : [{ title: '', votes: 0, color: '' }], // Set default options based on mode
  },
});

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'options',
  })

  // Function to handle adding a new option
  const handleAddOption = () => {
    append({ title: '', votes: 0, color: '' }) // Add a new option with default values
  }

  // Function to handle removing an option
  const handleRemoveOption = (index: number) => {
    remove(index) // Remove the option at the specified index
  }

  const { isSubmitting, isValid } = form.formState

  // console.log('isValid:', isValid)
  // console.log('mode:', mode)

  // const { id, imageUrl: oldImageUrl, ...badgeData } = badgeData || {}

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (mode === 'edit') {
        // get id into value to not make separate route for updating badge...
        const values: Poll = {
          id: pollData?.id!,
          question: form.getValues('question'),
          oldImageUrl: pollData?.imageUrl!,
          imageUrl: form.getValues('imageUrl'),
        }

        await axios.patch(`/api/badges`, values)
      } else {
        await axios.post(`/api/badges`, values)
      }
      toast.success('Badge erfolgreich erstellt')
      // setOpen(false) // Close the dialog
      setDialogOpen(false)
      onClose() // Close the dialog
      form.reset()
      mutate('/api/badges') // Trigger re-fetch
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/badges`, {
        data: { id: pollData?.id, imageUrl: pollData?.imageUrl },
      })
      toast.success('Badge erfolgreich gelöscht')
      onClose()
      mutate('/api/badges')
      router.refresh()
    } catch (error) {
      toast.error('Fehler beim Löschen des Badges')
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false) // Close the dialog
    // setOpen(false) // Close the dialog
    onClose() // Close the dialog
    form.reset() // Reset the form state
    router.refresh()
  }

  return (
    <Dialog open={open || dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="items-center text-center mt-8">
          <PlusCircle className="h-4 w-4 mr-2" />
          Umfrage erstellen
        </Button>
      </DialogTrigger>
      <DialogContent className=" max-w-[425px]  lg:w-full ">
        <DialogHeader>
          {mode === 'edit' ? (
            <DialogTitle>Umfrage bearbeiten</DialogTitle>
          ) : (
            <DialogTitle>Umfrage erstellen</DialogTitle>
          )}
          {mode === 'edit' ? (
            <DialogDescription>
              Bearbeite diese Umfrage. Klicke auf Speichern wenn fertig.
            </DialogDescription>
          ) : (
            <DialogDescription>
              Erstelle eine Umfrage. Klicke auf Speichern wenn fertig.
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid items-center gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      {mode === 'edit' ? (
                        <FormDescription>
                          Neue Umfrage erstellen
                        </FormDescription>
                      ) : (
                        <FormLabel>Frage eingeben</FormLabel>
                      )}
                      <FormControl>
                        <Input
                          id="question"
                          // id="name"
                          {...form.register('question')}
                          autoFocus={false} // Disable autofocus
                          // value={badgeData?.name || ''}
                          defaultValue={pollData?.question || ''}
                          placeholder="z.B. wie können wir die App besser machen?"
                          // className="col-span-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel>Mögliche Antworten:</FormLabel>
                {fields.map((option, index) => (
                  <div key={option.id} className="grid items-center gap-4 mt-2">
                    <Input
                      type="text"
                      {...form.register(`options.${index}.title` as const)}
                      defaultValue={option.title}
                      placeholder="z.B. neue Funktionen für den Editor"
                    />
                    {/* Add input fields for votes and color as needed */}
                    {/* <Input
                      type="number"
                      {...form.register(`options.${index}.votes` as const)}
                      defaultValue={option.votes}
                    /> */}
                    <Input
                      type="text"
                      {...form.register(`options.${index}.color` as const)}
                      defaultValue={option.color}
                      placeholder="z.B. bg-indigo-500"
                    />
                    <Button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={handleAddOption}>
                  Add Option
                </Button>
              </div>
            </div>
            <DialogFooter>
              <div className="grid grid-cols-3 md:grid-cols-0 gap-2 md:gap-2">
                <DialogClose asChild onClick={handleCloseDialog}>
                  <Button
                    type="button"
                    className="mr-auto md:mr-0 py-2 "
                    variant="secondary"
                  >
                    Zurück
                  </Button>
                </DialogClose>
                {mode === 'edit' ? (
                  <>
                    <Button
                      type="button"
                      className="py-2 mx-auto md:mx-0"
                      onClick={handleDelete}
                    >
                      Löschen
                    </Button>
                    <Button
                      type="submit"
                      className="py-2"
                      disabled={isSubmitting || !isValid}
                    >
                      {/* <Button type="submit" disabled={isSubmitting}> */}
                      Speichern
                    </Button>
                  </>
                ) : (
                  <Button
                    type="submit"
                    className="py-2 ml-auto md:ml-0 col-span-2 md:col-span-0"
                    disabled={isSubmitting || !isValid}
                  >
                    {/* <Button type="submit" disabled={isSubmitting}> */}
                    Speichern
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default PollDialog
