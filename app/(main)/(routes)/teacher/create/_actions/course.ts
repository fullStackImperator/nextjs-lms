'use server'

import { db } from '@/lib/db'
import { z } from 'zod'
import { auth } from '@clerk/nextjs'
import { isTeacher } from '@/lib/teacher'

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
})

export async function addCourse(
  data: z.infer<typeof courseSchema>
): Promise<{ id: string }> {
  try {
    const validationResult = courseSchema.safeParse(data)

    if (!validationResult.success) {
      console.error('Form validation failed:', validationResult.error)
      throw new Error('Validation failed')
    }

    const { userId } = auth()
    if (!userId || !isTeacher()) {
      throw new Error('Unauthorized')
    }

    const course = await db.course.create({
      data: {
        userId,
        title: validationResult.data.title,
      },
    })

    return { id: course.id }
  } catch (error) {
    console.error('Error creating course:', error)
    throw new Error('Course creation failed')
  }
}
