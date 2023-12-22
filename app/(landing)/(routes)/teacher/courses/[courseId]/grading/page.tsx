import { IconBadge } from '@/components/icon-badge'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { ArrowLeft, Eye, LayoutDashboard, Video } from 'lucide-react'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { GradingActions } from './_components/grading-action'
import toast from 'react-hot-toast'
import axios from 'axios'

import { clerkClient } from '@clerk/nextjs'


const CourseGradingPage = async ({
  params,
}: {
  params: { courseId: string }
}) => {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  // TODO: CHECK IF TEACHER

  const enrolledStudents = await db.purchase.findMany({
    where: {
      courseId: params.courseId,
    },
  })

  // Assuming Grading is related to Course
  const gradingPromises = enrolledStudents.map(async (enrollment) => {
    const grading = await db.grading.findFirst({
      where: {
        courseId: enrollment.courseId,
        userId: enrollment.userId,
      },
    })

    return {
      ...enrollment,
      grading: grading || null,
    }
  })

  const enrollmentWithGrading = await Promise.all(gradingPromises)

  // console.log('enrolledStudents: ', enrolledStudents)
  // console.log('enrollmentWithGrading: ', enrollmentWithGrading)
  
  
  const userList = await clerkClient.users.getUserList()
  
  console.log('userList: ', userList)


  return (
    <>
      <GradingActions
        courseId={params.courseId}
        enrollmentWithGrading={enrollmentWithGrading!}
      />
    </>
  )
}

export default CourseGradingPage
