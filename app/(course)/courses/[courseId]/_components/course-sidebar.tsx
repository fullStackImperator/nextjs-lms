import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { Chapter, Course, UserProgress } from "@prisma/client"
import { redirect } from "next/navigation"
import { CourseSidebarItem } from "./course-sidebar-item"
import { CourseProgress } from "@/components/course-progress"
import { CourseEnrollButton } from "../chapters/[chapterId]/_components/course-enroll-button"
import { CourseUnEnrollButton } from '../chapters/[chapterId]/_components/course-unenroll-button'

type CourseSidebarProps = {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null
        })[]
    }
    progressCount: number;
}


export const CourseSidebar = async ({
    course,
    progressCount,
}: CourseSidebarProps) => {

    const { userId } = auth()

    if (!userId) {
      return redirect('/')
    }

    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId: course.id
            }
        }
    })

    return (
      <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 flex flex-col border-b">
          <h1 className="font-semibold">{course.title}</h1>
          <h4 className="mt-2 text-muted-foreground md:text-md">
            Level: {course.level}
          </h4>
          {purchase && (
            <div className="mt-10">
              <CourseProgress variant="success" value={progressCount} />
            </div>
          )}
          {purchase && (
            <div className="mt-5">
              <CourseUnEnrollButton
                courseId={course.id}
                level={course.level!}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col w-full">
          {course.chapters.map((chapter) => (
            <CourseSidebarItem
              key={chapter.id}
              id={chapter.id}
              label={chapter.title}
              // !! is boolean
              isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
              courseId={course.id}
              isLocked={!chapter.isFree && !purchase}
            />
          ))}
        </div>
      </div>
    )
}

