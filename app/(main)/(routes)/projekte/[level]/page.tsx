// import { Banner } from '@/components/banner'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { getProgress } from '@/actions/get-progress'
import { SearchInput } from '@/components/search-input'
import { Categories } from '../../../_components/categories'
import { CoursesList } from '@/components/courses-list'
import { getCourses } from '@/actions/get-courses'



type CourseLevelPageProps = {
  params: {
    level: string
  }
  searchParams: {
    title: string
    categoryId?: string
  }
}


const CourseLevelPage = async ({ params, searchParams }: CourseLevelPageProps) => {
      
console.log('search params: ', searchParams)

    const { level } = params

console.log('level: ', level)
console.log('level type : ', typeof(level))

  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

    const courses = await getCourses({
      userId,
      level: level ?? '', // Provide a default value
      ...searchParams,
    })


  return (
    <>
      <div className="px-6 pt-6  md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories categories={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  )
}

export default CourseLevelPage
