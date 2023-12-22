'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Course } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

  const [updatedPoints, setUpdatedPoints] = useState<{
    [userId: string]: number
  }>({})

  const handleInputChange = (userId: string, points: number) => {
    setUpdatedPoints((prev) => ({ ...prev, [userId]: points }))
  }


export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: 'user',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Schüler
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'punkte',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Punkte
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: 'neue_punkte',
    cell: ({ row }) => {
      const { id } = row.original

      return (
        <Input
          id="punkte"
          defaultValue={student.grading?.points}
          onChange={(e) => {
            const newPoints = parseInt(e.target.value, 10) || 0
            handleInputChange(student.userId, newPoints)
          }}
          className="col-span-2 h-8"
        />
      )
    },
  },
]
