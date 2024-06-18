import { db } from '@/lib/db'
import { Categories } from '../../_components/categories'
import { SearchInput } from '@/components/search-input'
import { getCourses } from '@/actions/get-courses'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { CoursesList } from '@/components/courses-list'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { getLevelColor } from '@/lib/getLevelColor' // Adjust the import based on your utils location

// interface SearchPageProps {
//   searchParams: {
//     title: string;
//     categoryId: string;
//   }
// }

type SearchPageProps = {
  searchParams: {
    title: string
    categoryId?: string
  }
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
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
    ...searchParams,
  })

  const levels = await db.course.findMany({
    distinct: ['level'],
    select: {
      level: true,
    },
  })

  console.log('levels: ', levels)

  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid items-center justify-center gap-8 px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Level Up Deine Skills
            </h2>
            <p className="mx-auto max-w-[700px] mt-4 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Wähle dein Level
            </p>
          </div>
          <div className="grid grid-cols-2 items-center justify-center gap-6 sm:grid-cols-3 md:grid-cols-4 lg:gap-8">
            {levels.map(({ level }) => (
              <Link
                key={level}
                href={`/projekte/${level}`}
                className="flex flex-col items-center gap-2"
              >
                <Card>
                  <CardContent className="flex flex-col items-center gap-2 p-6">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${getLevelColor(
                        level
                      )}`}
                    >
                      <div className="h-6 w-6 rounded-full bg-gray-900 dark:bg-gray-50" />
                    </div>
                    <span className="text-sm font-medium">Level {level}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
            <Link
              href={`/projekte/alle-projekte`}
              className="flex flex-col items-center gap-2"
            >
              <Card>
                <CardContent className="flex flex-col items-center gap-2 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-500">
                    <div className="h-6 w-6 rounded-full bg-gray-900 dark:bg-gray-50" />
                  </div>
                  <span className="text-sm font-medium">Alle Level</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories categories={categories} />
        <CoursesList items={courses} />
      </div> */}
    </>
  )
}

export default SearchPage
