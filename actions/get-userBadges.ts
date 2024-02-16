import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'


interface UserBadge {
  // id: string
  // userId: string
  // badgeId: string
  badge: {
    id: string
    name: string
    imageUrl: string
    createdAt?: Date
    updatedAt?: Date
  }
}

export const getUserBadges = async (): Promise<UserBadge[]> => {
  const { userId: currentUserId } = auth() // Use a different variable name to avoid conflicts

  try {


    const userBadges = await db.userBadge.findMany({
      where: {
        userId: {
          equals: currentUserId || undefined, // Handle null or undefined userId
        },
      },
      include: {
        badge: true, // Include the associated badge data
      },
    })

    return userBadges.map((userBadge) => ({
      // id: userBadge.id,
      // userId: userBadge.userId,
      // badgeId: userBadge.badgeId,
      // badge: userBadge.badge,
      badge: userBadge.badge,
    }))
  } catch (error) {
    console.log('[GET_USER_BADGES]', error)
    return []
  }
}
