'use client'

import axios from 'axios'
import { ArrowLeft, Trash } from 'lucide-react'
import {
  useState,
} from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { ConfirmModal } from '@/components/modals/confirm-modal'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'





interface GradingActionsProps {
  courseId: string
  enrollmentWithGrading: {
    id: string
    courseId: string
    userId: string
    grading?: {
      id?: string
      userId?: string
      points?: number
      courseId?: string
      createdAt?: Date
      updatedAt?: Date
    } | null
  }[]
}

export const GradingActions = ({
  courseId,
  enrollmentWithGrading,
}: GradingActionsProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [updatedPoints, setUpdatedPoints] = useState<{
    [userId: string]: number
  }>({})

  const handleInputChange = (userId: string, points: number) => {
    setUpdatedPoints((prev) => ({ ...prev, [userId]: points }))
  }

  const onClick = async () => {
    try {
      setIsLoading(true)

      // Prepare data for update
      const updateData = Object.entries(updatedPoints).map(
        ([userId, points]) => ({
          userId,
          points,
        })
      )

      // Send request to update points
      await axios.patch(`/api/courses/${courseId}/update-grade`, updateData)

      toast.success('Punkte übertragen')
      router.refresh()
    } catch (error) {
      console.error('Error updating points:', error)
      toast.error('Something went wrong. Error updating points.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between align-middle">
        {/* <div className="flex items-center text-sm mb-6"> */}
        <Link
          href={`/teacher/courses`}
          className="flex items-center text-sm hover:opacity-75 transition "
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zur Kursübersicht
        </Link>
        {/* </div> */}
        <Button onClick={onClick} variant="outline" size="sm">
          Punkte übertragen
        </Button>
      </div>
      {/* <GradingActions 
            courseId={params.courseId}
        /> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <Table>
            <TableCaption>Points for enrolled students</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Schüler</TableHead>
                <TableHead>Punkte</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollmentWithGrading.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.userId}</TableCell>
                  <TableCell>
                    <Input
                      id={`punkte-${student.userId}`}
                      defaultValue={student.grading?.points}
                      onChange={(e) => {
                        const newPoints = parseInt(e.target.value, 10) || 0
                        handleInputChange(student.userId, newPoints)
                      }}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    {/* Add any additional action buttons or elements here */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
