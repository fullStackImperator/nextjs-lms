'use client'

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { text } from 'stream/consumers'

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  href: string
}

export const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const [isRotating, setIsRotating] = useState(false)

  const isActive =
    (pathname === '/' && href === '/') ||
    pathname === href ||
    pathname?.startsWith(`${href}/`)

  const onClick = () => {
    setIsRotating(true)
    router.push(href)
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (isRotating) {
      timeoutId = setTimeout(() => {
        setIsRotating(false)
      }, 1000) // Adjust the duration as needed
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isRotating])

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        // font-[500] hover:bg-slate-300/20
        'flex w-full items-center gap-x-2 rounded-lg text-muted-foreground  text-slate-500 text-sm pl-2 transition-all hover:bg-muted hover:text-slate-600 ',
        isActive &&
          'text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 font-[600] hover:text-sky-700'
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            'text-slate-500',
            isActive && 'text-sky-700 ',
            isRotating && 'pendulum-rotate'
          )}
        />
        {label}
      </div>
      {/* <div
        className={cn(
          'ml-auto opacity-0 border-2 border-sky-700 h-full transition-all',
          isActive && 'opacity-100'
        )}
      /> */}
    </button>
  )
}
