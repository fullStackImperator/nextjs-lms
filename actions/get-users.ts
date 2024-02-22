'use server'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'

interface User {
  id: string
  userName: string | null
  firstName: string
  lastName: string
  email: string
  isTeacher?: boolean | null
  createdAt?: Date
  updatedAt?: Date
}

export const getUsers = async (): Promise<User[]> => {
  const { userId: currentUserId } = auth() // Use a different variable name to avoid conflicts

  try {
    // find courses of the teacher !
    const users = await db.user.findMany({
      orderBy: {
        userName: 'desc',
      },
    })

    return users
  } catch (error) {
    console.log('[GET_USER_POINTS]', error)
    return []
  }
}
