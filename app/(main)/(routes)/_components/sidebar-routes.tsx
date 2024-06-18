"use client"
import { Sidebar } from "./sidebar"
import {
  Compass,
  Layout,
  List,
  BarChart,
  Trophy,
  ShieldPlus,
  Users,
  Columns3,
  MessageCircleQuestion,
  CalendarDays,
} from 'lucide-react'
import { SidebarItem } from "./sidebar-item"
import { usePathname } from "next/navigation"

const guestRoutes = [
  {
    icon: Layout,
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: Compass,
    label: 'Projekte',
    href: '/projekte',
  },
  {
    icon: Trophy,
    label: 'Leaderboard',
    href: '/leaderboard',
  },
  {
    icon: Columns3,
    label: 'Kanban',
    href: '/kanban',
  },
  {
    icon: MessageCircleQuestion,
    label: 'Umfragen',
    href: '/voting',
  },
  {
    icon: CalendarDays,
    label: 'Kalender',
    href: '/kalender',
  },
]

const teacherRoutes = [
  {
    icon: List,
    label: 'Meine Projekte',
    href: '/teacher/courses',
  },
  {
    icon: Users,
    label: 'Alle User',
    href: '/teacher/users',
  },
  {
    icon: ShieldPlus,
    label: 'Badges',
    href: '/teacher/create-badges',
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


