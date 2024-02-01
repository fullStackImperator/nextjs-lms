"use client"

import { Sidebar } from "./sidebar"
import { Compass, Layout, List, BarChart, Trophy } from 'lucide-react'
import { SidebarItem } from "./sidebar-item"
import { usePathname } from "next/navigation"

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        icon: Compass,
        label: "Projekte",
        href: "/search",
    },
    {
        icon: Trophy,
        label: "Leaderboard",
        href: "/leaderboard",
    }
]

const teacherRoutes = [
  {
    icon: List,
    label: 'Meine Projekte',
    href: '/teacher/courses',
  },
  {
    icon: BarChart,
    label: 'Analytics',
    href: '/teacher/analytics',
  },
]


export const SiedebarRoutes = () => {
    const pathname = usePathname()

    const isTeacherPage = pathname?.includes("/teacher")

    const routes = isTeacherPage ? teacherRoutes : guestRoutes
   
    return (
        <div className="flex flex-col w-full p-3 space-y-1.5">
            {routes.map((route) => (
                <SidebarItem 
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}




// import { Sidebar } from './sidebar'
// import { Compass, Layout, List, BarChart, User } from 'lucide-react'
// import { SidebarItem } from './sidebar-item'
// import { usePathname } from 'next/navigation'

// const guestRoutes = [
//   {
//     icon: Layout,
//     label: 'Dashboard',
//     href: '/',
//   },
//   {
//     icon: Compass,
//     label: 'Browse',
//     href: '/search',
//   },
// ]

// const teacherRoutes = [
//   {
//     icon: List,
//     label: 'Courses',
//     href: '/teacher/courses',
//   },
//   {
//     icon: BarChart,
//     label: 'Analytics',
//     href: '/teacher/analytics',
//   },
// ]

// const adminRoutes = [
//   {
//     icon: User,
//     label: 'Manage Users',
//     href: '/admin/users',
//   },
//   // Add more admin routes as needed
// ]

// export const SidebarRoutes = () => {
//   const pathname = usePathname()

//   // Determine the user's role based on the pathname or another mechanism
//   const role = determineRole(pathname)

//   // Choose the appropriate set of routes based on the user's role
//   let routes

//   switch (role) {
//     case 'teacher':
//       routes = teacherRoutes
//       break
//     case 'admin':
//       routes = adminRoutes
//       break
//     default:
//       routes = guestRoutes
//   }

//   return (
//     <div className="flex flex-col w-full">
//       {routes.map((route) => (
//         <SidebarItem
//           key={route.href}
//           icon={route.icon}
//           label={route.label}
//           href={route.href}
//         />
//       ))}
//     </div>
//   )
// }

// // Your custom logic to determine the user's role based on the pathname or other criteria
// const determineRole = (pathname) => {
//   if (pathname.includes('/teacher')) {
//     return 'teacher'
//   } else if (pathname.includes('/admin')) {
//     return 'admin'
//   } else {
//     return 'guest'
//   }
// }