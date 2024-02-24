import { useRouter } from 'next/router'
// import React, { useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CourseEnrollButton } from '../chapters/[chapterId]/_components/course-enroll-button'
import { CourseProgress } from '@/components/course-progress'
import { Button } from '@/components/ui/button'
import { CourseEnrollRedirectButton } from './course-enroll-redirect-button'

// interface Chapter {
//   id: string
//   title: string
//   description: string | null
//   descriptionEditor: Record<string, unknown> | null
//   videoUrl: string | null
//   position: number
//   isPublished: boolean
//   isFree: boolean
// //   muxData?: MuxData // Optional relationship with MuxData
//   courseId: string
// //   userProgress: UserProgress[]
//   createdAt: Date
//   updatedAt: Date
// }

// interface Category {
//   id: string
//   name: string
// //   courses: Course[] // Define the many-to-many relationship with Course
//   createdAt: Date
//   updatedAt: Date
// }

interface Category {
  id: string
  name: string
}

interface Chapter {
  id: string
  title: string
  description: string | null
  // descriptionEditor: JSON | null // Assuming descriptionEditor is an array of strings
  videoUrl: string | null
  position: number
  isPublished: boolean
  isFree: boolean
  courseId: string
  createdAt: Date
  updatedAt: Date
}

interface Purchase {
  id: string
  userId: string
  courseId: string
  createdAt: Date
  updatedAt: Date
}

interface Course {
  id: string
  userId: string
  title: string
  description: string | null
  prerequisites: string | null
  vorkenntnisse: string | null
  kompetenzen: string | null
  imageUrl: string 
  price: number | null
  level: number | null
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
  categories: Category[]
  chapters: Chapter[]
  purchases: Purchase[]
}

interface BannerProps {
  course: Course
  username?: string | null
  userProgress?: number | null
}

export const BannerCourse = ({
  course,
  username,
  userProgress,
}: BannerProps) => {
  // export const  BannerCourse = () => {
  // const router = useRouter()

  //   const { course_uuid } = router.query

  //   const courses = user?.courses || []

  return (
    <section
      className="w-full flex justify-center text-gray-50 bg-gray-800 py-14  relative"
      style={{
        backgroundImage: `url('/darklab.jpeg')`,
        backgroundSize: 'cover',
      }}
    >
      <div className="md:w-10/12 w-11/12 lg:w-8/12">
        <div className=" grid grid-cols-6 gap-x-4">
          <div className="col-span-4">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2">
              {course.title}
            </h1>
            <h3 className="text-sm md:text-lg mb-2">
              {course.description!.length > 200
                ? course.description!.slice(0, 199) + '...'
                : course.description}
            </h3>
            <h6 className="text-base md:text-base font-semibold mt-4 mb-1">
              Kategorien:{' '}
              {course.categories.map((category, index) => (
                <span key={category.id}>
                  {category.name}
                  {index < course.categories.length - 1 && ', '}
                </span>
              ))}
            </h6>
            <h6 className="text-base md:text-base font-semibold mb-10">
              Projekt Level: {course.level}
            </h6>
            <div className="mt-4 mb-8 flex flex-wrap items-center mb-2 md:text-base text-xs">
              <p className="mr-4 text-xs">
                Erstellt von{' '}
                <span className="text-blue-400 underline">{username}</span>
              </p>
              <p className="mr-4 text-xs">
                Erstellt am{' '}
                <span className="text-blue-400 underline">
                  {course.createdAt.toLocaleDateString()}
                </span>
              </p>
              <p className="text-xs">
                Zulätzt geändert am{' '}
                <span className="text-blue-400 underline ">
                  {course.updatedAt.toLocaleDateString()}
                </span>
              </p>
            </div>

            {course.purchases.length > 0 ? (
              <div>
                <CourseProgress
                  variant={userProgress === 100 ? 'success' : 'default'}
                  size="sm"
                  value={userProgress!}
                />
                <Link
                  href={`/courses/${course.id}/chapters/${course.chapters[0].id}`}
                  className="mt-4"
                >
                  <Button variant="success" className="mt-4">
                    {/* <Pencil className="h-4 w-4 mr-2" /> */}
                    Zum Projekt
                  </Button>
                </Link>
              </div>
            ) : (
              <CourseEnrollRedirectButton
                courseId={course.id}
                firstChapterId={course.chapters[0].id}
              />
            )}
          </div>

          <div className="col-span-2 relative">
            <Image src={course.imageUrl} fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
