// import { Banner } from '@/components/banner'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { BannerCourse } from './_components/banner-course'
import { WhatLearnt } from './_components/what-learnt'
import { Description } from './_components/course-description'
import { Vorkenntnisse } from './_components/course-vorkenntnisse'
import { Material } from './_components/course-material'
import { Kapitel } from './_components/course-kapitel'
import { auth } from '@clerk/nextjs'
import { getProgress } from '@/actions/get-progress'

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      categories: true,
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: 'asc',
        },
      },
      purchases: {
        where: {
          userId: userId,
          courseId: params.courseId,
        },
      },
    },
  })

  if (!course) {
    return redirect('/')
  }

  const userProgress = await getProgress(userId, params.courseId)

//   return {
//     ...course,
//     progress: progressPercentage,
//   }

console.log('course: ', course)
console.log('userProgress: ', userProgress)

  // Fetch username
  const user = await db.user.findUnique({
    where: {
      id: course.userId,
    },
  })

  // return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`)

  return (
    <div>
      {/* Hello */}
      <BannerCourse
        course={course}
        username={user?.userName}
        userProgress={userProgress}
      />
      <WhatLearnt kompetenzen={course.kompetenzen!} />
      <Kapitel chapters={course.chapters} />
      <Vorkenntnisse vorkenntnisse={course.vorkenntnisse} />
      <Material material={course.prerequisites} />
      <Description description={course.longDescription!} />
    </div>
  )
}

export default CourseIdPage
