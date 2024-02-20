import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { isTeacher } from '@/lib/teacher'

interface Leaderboard {
  [userId: string]: number;
}


export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()
    const { courseId } = params


    if (!userId || !isTeacher()) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const gradings = await db.grading.findMany({
        select: {
            userId: true,
            points: true,
            },
    })

    // const leaderboard = {}
    const leaderboard: Leaderboard = {}


    gradings.forEach((grading) => {
        const userId = grading.userId
        const points = grading.points

        if (leaderboard[userId]) {
            leaderboard[userId] += points
        } else {
            leaderboard[userId] = points
        }
    })

    // Convert leaderboard object to an array of objects
    const leaderboardArray = Object.keys(leaderboard).map((userId) => ({
        userId,
        totalPoints: leaderboard[userId],
    }))

    // Sort the leaderboard by totalPoints in descending order
    leaderboardArray.sort((a, b) => b.totalPoints - a.totalPoints)




    return NextResponse.json(leaderboardArray)
  } catch (error) {
    console.error('[COURSE_ID_ENROLLED_USERS]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
