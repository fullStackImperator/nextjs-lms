// import { Category, Course } from '@prisma/client'
// import { getProgress } from '@/actions/get-progress'
import { db } from '@/lib/db'

interface UserBadge {
  id: string
  name: string
  imageUrl: string
}

interface LeaderboardUser {
  userId: string
  totalPoints: number
  badges: UserBadge[]
}


export const getLeaderboard = async (): Promise<LeaderboardUser[]> => {
  try {
    const gradings = await db.grading.findMany({
      select: {
        userId: true,
        points: true,
      },
    })

    const leaderboard: LeaderboardUser[] = [] // Initialize leaderboard as an empty array

    for (const grading of gradings) {
      const { userId, points } = grading
      const userBadges = await db.userBadge.findMany({
        where: {
          userId,
        },
        select: {
          badge: true,
        },
      })

      const badges: UserBadge[] = userBadges.map((userBadge) => ({
        id: userBadge.badge.id,
        name: userBadge.badge.name,
        imageUrl: userBadge.badge.imageUrl,
      }))

      leaderboard.push({
        userId,
        totalPoints: points,
        badges,
      })
    }

    // Sort the leaderboard by totalPoints in descending order
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints)

    return leaderboard
  } catch (error) {
    console.log('[GET_LEADERBOARD]', error)
    return []
  }
}
