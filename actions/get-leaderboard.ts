import { Category, Course } from '@prisma/client'
import { getProgress } from '@/actions/get-progress'
import { db } from '@/lib/db'

type Leaderboard = {
  [userId: string]: number; // Define the shape of the leaderboard object
}

export const getLeaderboard = async (): Promise<Leaderboard[]> => {
  try {
    const gradings = await db.grading.findMany({
      select: {
        userId: true,
        points: true,
      },
    })

    const leaderboard: Leaderboard = {}; // Initialize leaderboard as an empty object

    gradings.forEach((grading) => {
      const userId = grading.userId;
      const points = grading.points;

      if (leaderboard[userId]) {
        leaderboard[userId] += points; // Increment points if userId exists in the leaderboard
      } else {
        leaderboard[userId] = points; // Otherwise, set points for the userId
      }
    });

    // Convert leaderboard object to an array of objects
    const leaderboardArray = Object.keys(leaderboard).map((userId) => ({
      userId,
      totalPoints: leaderboard[userId],
    }));

    // Sort the leaderboard by totalPoints in descending order
    leaderboardArray.sort((a, b) => b.totalPoints - a.totalPoints);

    return leaderboardArray;
  } catch (error) {
    console.log('[GET_LEADERBOARD]', error);
    return [];
  }
};