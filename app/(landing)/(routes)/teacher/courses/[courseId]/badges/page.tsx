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
import { BadgeActions } from './_components/badges-action'
import toast from 'react-hot-toast'
import axios from 'axios'

import { clerkClient } from '@clerk/nextjs'

const CourseBadgePage = async ({
  params,
}: {
  params: { courseId: string }
}) => {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  // TODO: CHECK IF TEACHER

  // get enrolled students
  const enrolledStudents = await db.purchase.findMany({
    where: {
      courseId: params.courseId,
    },
  })
  // console.log('enrolledStudents: ', enrolledStudents)

  
  // Assuming userBadges is related to User
  const badgePromises = enrolledStudents.map(async (enrollment) => {
    const userBadges = await db.userBadge.findMany({
      where: {
        userId: enrollment.userId,
      },
    })
    
    return {
      ...enrollment,
      userBadges: userBadges || null,
    }
  })
  
  const enrollmentWithBadges = await Promise.all(badgePromises)
  



  // get all badges
  const badges = await db.badge.findMany()



  // Fetch course details based on the courseId
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    select: {
      title: true,
    },
  })

  // const userList = await clerkClient.users.getUserList()
  // console.log('userList: ', userList)

  return (
    <>
      <BadgeActions
        badges={badges}
        enrollmentWithBadges={enrollmentWithBadges!}
        courseName={course?.title}
        options={badges.map((badge) => ({
          label: badge.name,
          value: badge.id,
        }))}
      />
    </>
  )
}

export default CourseBadgePage
