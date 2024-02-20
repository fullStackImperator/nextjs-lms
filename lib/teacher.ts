'use server'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'

// const teacherIds = [
//   process.env.NEXT_PUBLIC_TEACHER_ID,
//   process.env.NEXT_PUBLIC_TEACHER_ID2,
//   process.env.NEXT_PUBLIC_TEACHER_ID3,
//   process.env.NEXT_PUBLIC_TEACHER_ID4,
// ]

// export const isTeacher = (userId?: string | null) => {
//   return (
//     // teacherIds.includes(userId)
//     userId === process.env.NEXT_PUBLIC_TEACHER_ID ||
//     userId === process.env.NEXT_PUBLIC_TEACHER_ID2 ||
//     userId === process.env.NEXT_PUBLIC_TEACHER_ID3 ||
//     userId === process.env.NEXT_PUBLIC_TEACHER_ID4
//   )
// }

// export const isTeacher = (userId: string | null | undefined): boolean => {
//   if (userId === null || userId === undefined) {
//     return false // If userId is null or undefined, it's not a teacher
//   }
//   return teacherIds.includes(userId)
// }

export const isTeacher = async (): Promise<boolean> => {
  try {
    // console.log('in server. userId: ', userId)
    const { userId } = auth()

    console.log('in server. userId: ', userId)

    if (!userId) return false // If userId is not provided, return false

    // Query the database to retrieve the user based on userId
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        isTeacher: true,
      },
    })

    console.log('in server. user: ', user)
    console.log('in server. !!user?.isTeacher: ', !!user?.isTeacher)
    // Check if the user exists and is a teacher
    return !!user?.isTeacher // Return true if the user exists and is a teacher, false otherwise
  } catch (error) {
    console.error('Error checking teacher status:', error)
    return false // Return false in case of any errors
  }
}
