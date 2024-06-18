"use client"

import { Sidebar } from "./sidebar"
import { Compass, Layout, List, BarChart } from 'lucide-react'
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
        href: "/projekte",
    }
]

const teacherRoutes = [
  {
    icon: List,
    label: 'Projekte',
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
        <div className="flex flex-col w-full">
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



