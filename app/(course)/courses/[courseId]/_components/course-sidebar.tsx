import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { Chapter, Course, UserProgress } from "@prisma/client"
import { redirect } from "next/navigation"
import { CourseSidebarItem } from "./course-sidebar-item"
import { CourseProgress } from "@/components/course-progress"
import { CourseEnrollButton } from "../chapters/[chapterId]/_components/course-enroll-button"
import { CourseUnEnrollButton } from '../chapters/[chapterId]/_components/course-unenroll-button'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"


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
        {purchase && (
          <div className="flex flex-col mt-5 p-8">
            <Drawer>
              <DrawerTrigger>
                <Button variant="destructive" className="w-full">
                  AI Assistant
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-6xl">
                  <DrawerHeader className="text-center flex flex-col items-center">
                    <DrawerTitle>Chatte mit AI</DrawerTitle>
                    <DrawerDescription>
                      Stelle Fragen oder fordere Erklaerungen
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 pb-0">
                    <div className="mt-3 mb-4 h-[420px]">
                      <iframe
                        src="https://interfaces.zapier.com/embed/page/clo2s9nrg203090pmsbd6su8eh?"
                        style={{
                          maxWidth: '1200px',
                          width: '100%',
                          height: '440px',
                        }}
                      ></iframe>
                    </div>
                  </div>
                  <DrawerFooter>
                    {/* <Button>Submit</Button> */}
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        )}
      </div>
    )
}

