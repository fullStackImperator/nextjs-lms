import { db } from '@/lib/db'
import { Categories } from './_components/categories'
import { SearchInput } from '@/components/search-input'
import { redirect } from 'next/navigation'
// import { CoursesList } from '@/components/courses-list'
import { getLandingpageCourses } from '@/actions/get-landingpage-courses'
import { CoursesListLanding } from '@/components/courses-list-landing'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import Image from 'next/image'
import { MainNav } from '@/components/main-nav'
import { marketingConfig } from '@/config/nav-config'
import { cn } from '@/lib/utils'
import {
  SignIn,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'


// interface SearchPageProps {
//   searchParams: {
//     title: string;
//     categoryId: string;
//   }
// }

type SearchPageProps = {
  searchParams: {
    title: string
    categoryId: string
  }
}

const LandingPage = async ({ searchParams }: SearchPageProps) => {

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  const courses = await getLandingpageCourses({
    ...searchParams,
  })

  // console.log('items: ', courses)

  return (
    <>
      <div className="px-6 flex h-20 items-center justify-between py-6">
        <MainNav items={marketingConfig.mainNav} />
        <nav>
          <Link
            href="/search"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'px-4'
            )}
            target="_blank"
          >
            Anmelden
          </Link>
          {/* <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded border border-gray-400 px-3 py-0.5">
                Anmelden
              </button>
            </SignInButton>
          </SignedOut> */}
        </nav>
      </div>

      <MaxWidthWrapper className="mb-12 mt-4 sm:mt-40 flex flex-col items-center justify-center text-center">
        <h1 className="max-w-4xl text-5xl font-bold  text-red-700 md:text-6xl lg:text-7xl">
          Starte coole <span className="text-stone-950">Projekte</span> und
          verdiene dir den <span className="text-stone-950 ">schwarzen</span>{' '}
          Gürtel
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
          Im online Makerspace kannst du Projekte unter Anleitung erstellen und
          vom zum Schwarzgurt von dem Shogun sammeln. Erklimme den Thron!
        </p>

        <Link
          className={buttonVariants({
            size: 'lg',
            className: 'mt-5',
          })}
          href="/dashboard"
          target="_blank"
        >
          Leg los! <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </MaxWidthWrapper>

      {/* value proposition section */}
      <div>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="px-6 pt-6">
          <SearchInput />
        </div>
        <div className="p-6 space-y-4">
          <Categories categories={categories} />
          {/* <CoursesListLanding items={courses} /> */}
        </div>
      </div>
    </>
  )
}

export default LandingPage
