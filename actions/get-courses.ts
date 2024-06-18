import { Category, Course } from '@prisma/client'

import { getProgress } from '@/actions/get-progress'
import { db } from '@/lib/db'

type CourseWithProgressWithCategory = Course & {
  categories: Category[] | null
  chapters: { id: string }[]
  progress: number | null
}

type GetCourses = {
  userId: string
  level?: string
  title?: string
  categoryId?: string
}

export const getCourses = async ({
  userId,
  level,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        ...(level && { level: parseInt(level) }),
        ...(title && { title: { contains: title } }),
        ...(categoryId && { categories: { some: { id: categoryId } } }),
      },
      include: {
        categories: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // console.log('courses: ', courses)
    // console.log('courses: ', courses)

    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
            }
          }

          const progressPercentage = await getProgress(userId, course.id)

          return {
            ...course,
            progress: progressPercentage,
          }
        })
      )

    // const coursesWithProgress: CourseWithProgressWithCategory[] =
    //   await Promise.all(
    //     courses.map(async (course) => {
    //       const progressPercentage =
    //         course.purchases.length === 0
    //           ? null
    //           : await getProgress(userId, course.id)

    //       return {
    //         ...course,
    //         progress: progressPercentage,
    //       }
    //     })
    //   )

    // console.log('coursesWithProgress: ', coursesWithProgress)

    return coursesWithProgress
  } catch (error) {
    console.log('[GET_COURSES]', error)
    return []
  }
}
