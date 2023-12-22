import { Category, Course } from '@prisma/client'

// import { getProgress } from '@/actions/get-progress'
import { db } from '@/lib/db'

type CourseWithCategory = Course & {
  category: Category | null
  chapters: { id: string }[]
//   progress: number | null
}

type GetCourses = {
//   userId: string
  title?: string
  categoryId?: string
}

export const getLandingpageCourses = async ({
//   userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })



    return courses
  } catch (error) {
    console.log('[GET_COURSES]', error)
    return []
  }
}
