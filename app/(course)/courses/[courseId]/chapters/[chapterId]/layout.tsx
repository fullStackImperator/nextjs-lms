import { getProgress } from '@/actions/get-progress'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { CourseSidebar } from '@/app/(course)/courses/[courseId]/_components/course-sidebar'
import { CourseNavbar } from '@/app/(course)/courses/[courseId]/_components/course-navbar'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'



const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { courseId: string }
}) => {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  })

  if (!course) {
    return redirect('/')
  }

  const progressCount = await getProgress(userId, course.id)

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-0 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className="hidden pt-[80px] md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
            <CourseSidebar 
                course={course}
                progressCount={progressCount}
            />
        </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  )
}

export default CourseLayout


    //   <ResizablePanelGroup direction="horizontal">
    //     <ResizablePanel defaultSize={25}>
    //       <div className="flex h-full items-center justify-center p-6 z-50">
    //         {/* <div className="hidden pt-[80px] md:flex h-full w-80 flex-col fixed inset-y-0 z-50"> */}
    //         <CourseSidebar course={course} progressCount={progressCount} />
    //       </div>
    //     </ResizablePanel>
    //     <ResizableHandle withHandle />{' '}
    //     <ResizablePanel defaultSize={75}>
    //       <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    //     </ResizablePanel>
    //   </ResizablePanelGroup>
    // </div>