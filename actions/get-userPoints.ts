import { Category, Course } from '@prisma/client'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'


export const getUserPoints = async (): Promise<number> => {
  const { userId: currentUserId } = auth() // Use a different variable name to avoid conflicts

  try {
    const gradings = await db.grading.findMany({
      select: {
        userId: true,
        points: true,
      },
    })

    let userPoints = 0

    gradings.forEach((grading) => {
      const userId = grading.userId
      const points = grading.points

      if (grading.userId === currentUserId) {
        userPoints += grading.points
      }
    })

    return userPoints
  } catch (error) {
    console.log('[GET_USER_POINTS]', error)
    return 0
  }
}
