import { IconBadge } from '@/components/icon-badge'
import {
  LayoutDashboard,
  ListChecks,
  Wrench,
  Dumbbell,
  BookCheck,
  BookPlus,
  ArrowLeft,
} from 'lucide-react'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { TitleForm } from './_components/title-form'
import { DescriptionForm } from './_components/description-form'
import { ImageForm } from './_components/image-form'
import { CategoryForm } from './_components/category-form'
// import { PriceForm } from './_components/price-form'
// import { AttachmentForm } from './_components/attachment-form'
import { ChaptersForm } from './_components/chapters-form'
// import Link from 'next/link'
import { CourseActions } from './_components/course-actions'
import { Banner } from '@/components/banner'
import { PrerequisiteForm } from './_components/prerequisite-form'
import { VorkenntnisseForm } from './_components/vorkenntnisse-form'
import { KompetenzenForm } from './_components/kompetenz-form'
import { LevelForm } from './_components/level-form'
import { LongDescriptionForm } from './_components/longDescription-form'
import Link from 'next/link'


const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: 'asc',
        },
      },
      attachments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      categories: true, // Include categories related to the course
    },
  })

  // console.log('course from db: ', course)


  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  // console.log(categories)

  if (!course) {
    return redirect('/')
  }

  const requiredFields = [
    course.title,
    course.description,
    course.longDescription,
    course.imageUrl,
    course.price,
    // course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
    course.prerequisites,
    course.vorkenntnisse,
    course.kompetenzen,
  ]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length

  const completionText = `(${completedFields}/${totalFields})`

  const isComplete = requiredFields.every(Boolean)

  return (
    <>
      {!course.isPublished && (
        <Banner
          variant="warning"
          label="Dieser Kurs ist nicht veröffentlicht. Er wird im Dashboard nicht sichtbar sein."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <Link
              href={`/teacher/courses`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6 "
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zur Kursübersicht
            </Link>
            <h1 className="text-2xl font-medium">Projekt Gestaltung</h1>
            <span className="text-sm text-slate-700">
              Alle Felder ausfüllen {completionText}
            </span>
          </div>
          <CourseActions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Projekt Informationen</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <LongDescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Projekt Kapitel</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center mt-8 gap-x-2">
                <IconBadge icon={Dumbbell} />
                <h2 className="text-xl">Schwierigkeitsgrad</h2>
              </div>
              {/* <PriceForm initialData={course} courseId={course.id} /> */}
              <LevelForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center mt-8 gap-x-2">
                <IconBadge icon={Wrench} />
                <h2 className="text-xl">Benötigte Materialien</h2>
              </div>
              {/* <AttachmentForm initialData={course} courseId={course.id} /> */}
              <PrerequisiteForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center mt-8 gap-x-2">
                <IconBadge icon={BookCheck} />
                <h2 className="text-xl">Benötigte Vorkenntnisse</h2>
              </div>
              {/* <AttachmentForm initialData={course} courseId={course.id} /> */}
              <VorkenntnisseForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center mt-8 gap-x-2">
                <IconBadge icon={BookPlus} />
                <h2 className="text-xl">Zu erwerbende Kompetenzen</h2>
              </div>
              {/* <AttachmentForm initialData={course} courseId={course.id} /> */}
              <KompetenzenForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseIdPage
