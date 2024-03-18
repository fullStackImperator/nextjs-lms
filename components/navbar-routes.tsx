'use client'

import { UserButton, useAuth } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'
// import { useRouter } from "next/router"
import { Button } from '@/components/ui/button'
import { LogOut, UserCog } from 'lucide-react'
import Link from 'next/link'
import { SearchInput } from './search-input'
import { isTeacher } from '@/lib/teacher'
import useSwr from 'swr'
import { Logo } from '@/app/(main)/(routes)/_components/logo'
// import useSwr from 'swr'

export const NavbarRoutes = () => {
  const { userId } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isTeacherPage = pathname?.startsWith('/teacher')
  const isPlayerPage = pathname?.includes('/courses')
  const isSearchPage = pathname === '/search'

  const {
    data: userIsTeacher,
    isLoading,
    isValidating,
    mutate,
    error,
  } = useSwr('isTeacher', isTeacher)

  // const { data: isTeacher, error } = useSWR(userId ? userId : null, fetchTeacherStatus);

  // const {
  //   data: isTeacher,
  //   isLoading,
  //   isValidating,
  //   mutate,
  //   error,
  // } = useSwr('users', fetchTeacherStatus(userId))

  // const { data: orders } = useSWR({ url: '/api/orders', args: userId }, isTeacher)

  // const { data: userIsTeacher, error } = useSWR('isTeacher', () =>
  //   isTeacher(userId)
  // )

  // console.log('userId: ', userId)
  // console.log('client error: ', error)
  // console.log('client userIsTeacher: ', userIsTeacher)

  if (error) {
    return <div>Error: {error.message}</div>
  }

  // const isUserTeacher = userId && await isTeacher(userId)

  return (
    <>
      <div className="px-6">
        <Logo />
      </div>
      <div>
        <h1 className="text-2xl font-extrabold text-slate-600 tracking-wide">
          MiSHN
        </h1>
        <p className="text-xs text-muted-foreground">
          Makerspaces in Schulen Hamburg Netzwerk
        </p>
      </div>

      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isPlayerPage ? (
          <Link href="/dashboard">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : userIsTeacher ? (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              <UserCog className="h-4 w-4 mr-2" />
              Lehrer modus
            </Button>
          </Link>
        ) : null}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  )
}

//   return (
//     <>
//       {isSearchPage && (
//         <div className="hidden md:block">
//           <SearchInput />
//         </div>
//       )}
//       <div className="flex gap-x-2 ml-auto">
//         {(isTeacherPage || isPlayerPage) && (
//           <Link href="/dashboard">
//             <Button size="sm" variant="ghost">
//               <LogOut className="h-4 w-4 mr-2" />
//               Exit
//             </Button>
//           </Link>
//         )}
//         {isUserTeacher && (
//           <Link href="/teacher/courses">
//             <Button size="sm" variant="ghost">
//               <UserCog className="h-4 w-4 mr-2" />
//               Lehrer modus
//             </Button>
//           </Link>
//         )}
//         <UserButton afterSignOutUrl="/" />
//       </div>
//     </>
//   )
// }
