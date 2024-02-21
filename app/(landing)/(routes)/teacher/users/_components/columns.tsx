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
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react'
import Link from 'next/link'
import { Combobox } from '@/components/ui/combobox'
import { useState } from 'react'



type UserProps = {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  isTeacher?: boolean | null
}

type ColumnsProps = {
  handleIsTeacherChange: (userId: string, value: boolean) => void
  userIsTeacher: { [userId: string]: boolean }
}



export const columns = ({
  handleIsTeacherChange,
  userIsTeacher,
}: ColumnsProps): ColumnDef<UserProps>[] => [
  {
    accessorKey: 'username',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Vorname
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nachname
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'isTeacher',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Rolle
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const isTeacherValue = row.original.isTeacher;
      return <span>{isTeacherValue ? 'Lehrer' : 'Schüler'}</span>
    },
  },
  {
    header: 'Rolle ändern',
    id: 'actions',
    cell: ({ row }) => {
      const { id, isTeacher } = row.original

      return (
        <Combobox
          options={[
            { label: 'Zum Lehrer ernennen', value: 'true' },
            { label: 'Zum Schüler ernennen', value: 'false' },
          ]}
          value={
            userIsTeacher[id] !== undefined
              ? userIsTeacher[id].toString()
              : undefined
          }
          onChange={(value) =>
            handleIsTeacherChange(id, value === 'true' ? true : false)
          } // Convert string back to boolean
          // onChange={() => {}}
        />
      )
    },
  },
]
