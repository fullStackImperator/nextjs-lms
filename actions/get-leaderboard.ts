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
  userName: string | null | undefined
  userImageUrl: string | null | undefined
  totalPoints: number
  badges: UserBadge[]
}


export const getLeaderboard = async (): Promise<LeaderboardUser[]> => {
  try {
    // Fetch all gradings including userId and points
    const gradings = await db.grading.findMany({
      select: {
        userId: true,
        points: true,
      },
    })

    // Initialize an object to store cumulative points for each user
    const userPointsMap: Record<string, number> = {}

    // Aggregate points for each user
    for (const grading of gradings) {
      const { userId, points } = grading
      // Add points to the cumulative total for the user
      userPointsMap[userId] = (userPointsMap[userId] || 0) + points
    }

    // Initialize leaderboard as an empty array
    const leaderboard: LeaderboardUser[] = []

    // Fetch user information and badges
    for (const userId of Object.keys(userPointsMap)) {
      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          userName: true,
          userImageUrl: true,
        },
      })

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
        userName: user?.userName,
        userImageUrl: user?.userImageUrl,
        totalPoints: userPointsMap[userId], // Set total points for the user
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
