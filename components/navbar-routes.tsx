'use client'

import { UserButton, useAuth } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'
// import { useRouter } from "next/router"
import { Button } from '@/components/ui/button'
import { LogOut, UserCog } from 'lucide-react'
import Link from 'next/link'
import { SearchInput } from './search-input'
import { isTeacher } from '@/lib/teacher'

export const NavbarRoutes = () => {
  const { userId } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isTeacherPage = pathname?.startsWith('/teacher')
  const isPlayerPage = pathname?.includes('/courses')
  const isSearchPage = pathname === '/search'


  const isUserTeacher = userId && isTeacher(userId)

    return (
      <>
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
          ) : isTeacher(userId) ? (
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
