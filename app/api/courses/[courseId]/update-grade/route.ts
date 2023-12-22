import { User } from 'lucide-react'
import Mux from '@mux/mux-node'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { isTeacher } from '@/lib/teacher'

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()
    const { courseId } = params
    const updateData = await req.json()

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    console.log('updateData:', updateData)

    // Loop through updateData and update the database accordingly
    for (const { userId, points } of updateData) {
      // Check if the record exists
      const existingRecord = await db.grading.findFirst({
        where: {
          AND: {
            userId: userId,
            courseId: courseId,
          },
        },
      })

      if (existingRecord) {
        // Update the existing record
        await db.grading.update({
          where: { userId_courseId: { userId, courseId } },
          data: { points },
        })
      } else {
        // Create a new record if it doesn't exist
        await db.grading.create({
          data: {
            userId,
            courseId,
            points,
          },
        })
      }
    }


    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[COURSE_ID_ENROLLED_USERS]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
