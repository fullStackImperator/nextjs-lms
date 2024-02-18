'use client'

import axios from 'axios'
import { ArrowLeft, Trash } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { ConfirmModal } from '@/components/modals/confirm-modal'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Combobox } from '@/components/ui/combobox'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BadgeLoeschenModal } from '@/components/modals/badge-user-delete'

type Badge = {
  id: string
  name: string
  imageUrl: string
  createdAt?: Date
  updatedAt?: Date
}

interface BadgeActionsProps {
  // badges: Badge[]
  badges: {
    id: string
    name: string
    imageUrl: string
    createdAt?: Date
    updatedAt?: Date
  }[]
  // enrollmentWithBadges: EnrollmentWithBadges[]
  enrollmentWithBadges: {
    id: string
    courseId: string
    userId: string
    userBadges?:
      | {
          id?: string
          userId?: string
          badgeId?: string
          badge?: Badge
          createdAt?: Date
          updatedAt?: Date
        }[]
      | null
  }[]
  courseName?: string
  options: { label: string; value: string }[]
}

export const BadgeActions = ({
  badges,
  enrollmentWithBadges,
  courseName,
  options,
}: BadgeActionsProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBadges, setSelectedBadges] = useState<{
    [userId: string]: string | null
  }>({})

  // const handleInputChange = (userId: string, badge: string) => {
  //   setUpdatedPoints((prev) => ({ ...prev, [userId]: points }))
  // }

  const handleBadgeChange = (value: string | null, userId: string) => {
    setSelectedBadges((prevState) => ({
      ...prevState,
      [userId]: value,
    }))
  }

  const onClick = async () => {
    try {
      setIsLoading(true)

      const updateData = Object.entries(selectedBadges).map(
        ([userId, badgeId]) => ({
          userId,
          badgeId,
        })
      )

      // Send request to update points
      await axios.patch(`/api/badges/give-badges`, updateData)

      toast.success('Badges vergeben')

      // Reset selectedBadges to empty object after successful API call
      setSelectedBadges({}) // Reset ComboBoxes to empty

      router.refresh()
    } catch (error) {
      console.error('Error updating points:', error)
      toast.error('Something went wrong. Error updating points.')
    } finally {
      setIsLoading(false)
    }
  }



    const onDelete = async ( userId: string, badgeId: string, userBadgeId: string) => {
      try {
        setIsLoading(true)

        // Ensure userId and badgeId are not null or undefined
        if (!userId || !badgeId) {
          toast.error('Invalid userId or badgeId')
          return
        }

        console.log('userId: ', userId)
        console.log('badgeId: ', badgeId)
        console.log('userBadgeId: ', userBadgeId)

        await axios.delete(`/api/badges/give-badges`, {
          data: { userId, badgeId, userBadgeId }, // Include userId and badgeId in the request data
        })

        toast.success('Erfolgreich vom Schüler gelöscht')

        router.refresh()
      } catch (error) {
        console.log('error: ', error)
        toast.error('Something went wrong')
      } finally {
        setIsLoading(false)
      }
    }



  return (
    <div className="p-6">
      <div className="flex items-center justify-between align-middle">
        <Link
          href={`/teacher/courses`}
          className="flex items-center text-sm hover:opacity-75 transition "
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zur Kursübersicht
        </Link>
        <Button onClick={onClick} variant="success" size="sm">
          Badges übernehmen
        </Button>
      </div>
      {/* <GradingActions 
            courseId={params.courseId}
        /> */}
      <h1 className="p-6 mt-6 text-xl font-bold">Kurs: {courseName}</h1>
      <h4 className="pl-6 mb-4 text-muted-foreground">
        Badges für angemeldete Schüler erteilen
      </h4>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16"> */}
      <div className="space-y-4">
        <div className="flex flex-col relative gap-4 w-full">
          <div className="w-full p-4 z-0 flex flex-col relative justify-between gap-4 overflow-auto rounded-lg shadow-small">
            <Table className="min-w-full h-auto table-auto w-full">
              {/* <TableCaption>Points for enrolled students</TableCaption> */}
              <TableHeader>
                <TableRow>
                  <TableHead>Schüler</TableHead>
                  <TableHead>Schüler Badges</TableHead>
                  <TableHead>Badge vergeben</TableHead>
                  {/* <TableHead>Action</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollmentWithBadges.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.userId}</TableCell>

                    <TableCell>
                      {student.userBadges ? (
                        <div className="flex flex-wrap">
                          {student.userBadges.map((userBadge) => (
                            <BadgeLoeschenModal
                              onDelete={onDelete}
                              key={userBadge.id}
                              userId={student.userId}
                              badgeId={userBadge?.badgeId!}
                              userBadgeId={userBadge?.id!}
                            >
                              <div className="flex flex-col items-center mr-4  transition ease-in-out delay-100 hover:cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:scale-105   rounded-lg p-2 bg-orange-200  border border-red-400">
                                <Avatar className="h-10 w-10  border border-white">
                                  <AvatarImage
                                    src={
                                      badges.find(
                                        (badge) =>
                                          badge.id === userBadge.badgeId
                                      )?.imageUrl
                                    }
                                    alt={
                                      badges.find(
                                        (badge) =>
                                          badge.id === userBadge.badgeId
                                      )?.name
                                    }
                                  />
                                  <AvatarFallback>BG</AvatarFallback>
                                </Avatar>
                                <span className="mt-1 text-xs text-muted-foreground">
                                  {
                                    badges.find(
                                      (badge) => badge.id === userBadge.badgeId
                                    )?.name
                                  }
                                </span>
                              </div>
                            </BadgeLoeschenModal>
                          ))}
                        </div>
                      ) : (
                        'No badges'
                      )}
                    </TableCell>
                    <TableCell>
                      {/* TODO: COMBOBOX and multiple badges possible */}
                      <Combobox
                        options={options}
                        value={selectedBadges[student.userId] || null}
                        onChange={(value) =>
                          handleBadgeChange(value, student.userId)
                        }
                        // onChange={() => {}}
                      />
                    </TableCell>
                    {/* <TableCell> */}
                    {/* Add any additional action buttons or elements here */}
                    {/* </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  )
}
