import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { Chapter, Course, UserProgress } from '@prisma/client'
import { redirect } from 'next/navigation'
import { CourseSidebarItem } from './course-sidebar-item'
import { NavbarRoutes } from '@/components/navbar-routes'
import { CourseMobileSidebar } from './course-mobile-sidebar'

type CourseNavbarProps = {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  }
  progressCount: number
}

export const CourseNavbar = ({
  course,
  progressCount,
}: CourseNavbarProps) => {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

 
  return (
    <div className="p-4 h-full border-b flex items-center bg-white shadow-sm">
        <CourseMobileSidebar 
            course={course}
            progressCount={progressCount}
        />
        <NavbarRoutes />
    </div>
  )
}
