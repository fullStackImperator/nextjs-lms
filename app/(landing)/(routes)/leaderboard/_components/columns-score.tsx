'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Course } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react'
import Link from 'next/link'

export const columnsScore: ColumnDef<Course>[] = [
  {
    accessorKey: 'rang',
    header: "Rang"
  },
  {
    accessorKey: 'maker',
    header: "Maker"
  },
  {
    accessorKey: 'punkte',
    header: "Punkte"
  },
]
