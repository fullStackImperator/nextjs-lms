import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import Preview from "@/components/preview";
import { File } from "lucide-react";
// import { CourseProgressButton } from "./_components/course-progress-button";
import { CourseProgressButton } from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/course-progress-button";
import { YooptaValue } from '@/lib/yopta/initialData'


const ChapterIdPage = async ({
    params
}: {
    params: {courseId: string; chapterId: string;}
}) => {

    const { userId } = auth()

    if (!userId) {
        return redirect("/")
    }

    const {
        chapter,
        course,
        // muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
    } = await getChapter({
        userId: userId,
        courseId: params.courseId,
        chapterId: params.chapterId,
    })

    if (!chapter || !course) {
        return redirect('/')
    }
 

    const isLocked = !chapter.isFree && !purchase
    const completeOnEnd = !!purchase && !userProgress?.isCompleted

    // console.log("next chapter id", nextChapter?.id)
    // console.log('!!userProgress?.isCompleted', !!userProgress?.isCompleted)


    return (
      <div className="">
        {userProgress?.isCompleted && (
          <Banner
            variant="success"
            label="Du hast das Kapitel bereits abgeschloßen."
          />
        )}
        {isLocked && (
          <Banner
            variant="warning"
            label="Du musst dich für den Kurs anmelden."
          />
        )}
        <div className="flex flex-col max-w-4xl mx-auto pb-20">
          {/* <div className="p-4">
            <VideoPlayer
              chapterId={params.chapterId}
              title={chapter.title}
              courseId={params.courseId}
              nextChapterId={nextChapter?.id}
              playbackId={muxData?.playbackId!}
              isLocked={isLocked}
              completeOnEnd={completeOnEnd}
            />
          </div> */}
          <div>
            <div className="p-4 flex flex-col md:flex-row items-center justify-between">
              <h2 className="text-2xl font-semibold nb-2">{chapter.title}</h2>
              {purchase ? (
                <CourseProgressButton
                  chapterId={params.chapterId}
                  courseId={params.courseId}
                  nextChapterId={nextChapter?.id}
                  isCompleted={!!userProgress?.isCompleted}
                />
              ) : (
                <CourseEnrollButton
                  courseId={params.courseId}
                  level={course.level!}
                />
              )}
            </div>
            <Separator />
            <div className="mt-4">
              <Preview value={chapter.descriptionEditor! as YooptaValue[]} />
            </div>
            {!!attachments.length && (
              <>
                <Separator />
                <div className="p-4">
                  {attachments.map((attachment) => (
                    <a
                      href={attachment.url}
                      target="_blank"
                      key={attachment.id}
                      className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                    >
                      <File />
                      <p className="line-clamp-1">{attachment.name}</p>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
}
 
export default ChapterIdPage;