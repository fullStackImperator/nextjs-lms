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
  name: z.string().min(1, {
    message: 'Ein Name für den Badge ist erforderlich',
  }),
  imageUrl: z.string().min(1, {
    message: 'Bild ist erforderlich',
  }),
})

type Badge = {
  id: string
  name: string
  imageUrl: string
  oldImageUrl?: string // Include oldImageUrl in the type definition
  createdAt?: Date
  updatedAt?: Date
}

type BadgesDialogProps = {
  open: boolean
  onClose: () => void
  badgeData?: Badge
  mode: 'create' | 'edit'
}

const BadgesDialog = ({
  open,
  onClose,
  badgeData,
  mode,
}: BadgesDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  // console.log('badgeData:', badgeData)
  // console.log('mode:', mode)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: mode === 'edit' ? badgeData?.name : '', // Set default name based on mode
      imageUrl: mode === 'edit' ? badgeData?.imageUrl : '', //
    },
  })

  const { isSubmitting, isValid } = form.formState

  // console.log('isValid:', isValid)
  // console.log('mode:', mode)

  // const { id, imageUrl: oldImageUrl, ...badgeData } = badgeData || {}

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (mode === 'edit') {
        // get id into value to not make separate route for updating badge...
        const values: Badge = {
          id: badgeData?.id!,
          name: form.getValues('name'),
          oldImageUrl: badgeData?.imageUrl!,
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
        data: { id: badgeData?.id, imageUrl: badgeData?.imageUrl },
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
          Badge erstellen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {mode === 'edit' ? (
            <DialogTitle>Badge bearbeiten</DialogTitle>
          ) : (
            <DialogTitle>Badge erstellen</DialogTitle>
          )}
          {mode === 'edit' ? (
            <DialogDescription>
              Bearbeite diesen Badge. Klicke auf Speichern wenn fertig.
            </DialogDescription>
          ) : (
            <DialogDescription>
              Erstelle einen Badge. Klicke auf Speichern wenn fertig.
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid items-center gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      {mode === 'edit' ? (
                        <FormDescription>
                          Neuen Badge Namen eingeben
                        </FormDescription>
                      ) : (
                        <FormDescription>Badge Namen eingeben</FormDescription>
                      )}
                      <FormControl>
                        <Input
                          id="name"
                          // id="name"
                          {...form.register('name')}
                          autoFocus={false} // Disable autofocus
                          // value={badgeData?.name || ''}
                          defaultValue={badgeData?.name || ''}
                          placeholder="z.B. Arduino"
                          // className="col-span-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid items-center gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      {mode === 'edit' ? (
                        <FormDescription>Badge Bild ändern</FormDescription>
                      ) : (
                        <FormDescription>Badge Bild hinzufügen</FormDescription>
                      )}
                      <FormControl>
                        <FileUpload
                          {...form.register('imageUrl')}
                          endpoint="badgeImage"
                          onChange={(url) => {
                            console.log('url: ', url)
                            if (url) {
                              form.setValue('imageUrl', url)
                              form.trigger('imageUrl')
                              console.log('url: ', url)
                            }
                          }}
                          // previewUrl={badgeData?.imageUrl}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

export default BadgesDialog
