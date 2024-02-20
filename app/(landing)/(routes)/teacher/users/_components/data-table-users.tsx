'use client'

import * as React from 'react'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Suspense } from 'react'
import Loading from '../loading'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  handleIsTeacherChange: (userId: string, value: boolean) => void
  userIsTeacher: { [userId: string]: boolean }
}

export function DataTableUsers<TData, TValue>({
  columns,
  data,
  handleIsTeacherChange,
  userIsTeacher,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  // if (!data) {
  //   return <div>Loading...</div>
  // }

  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="User nach Usernamen suchen..."
          value={
            (table.getColumn('username')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('username')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      {/* TODO:  Search in multiple columns in one input field...  tried with code below... */}

      {/* <div className="flex items-center py-4 justify-between">
        {columns.map((column) => (
          <div key={column.accessorKey} className="max-w-sm">
            <Input
              placeholder={`Filter ${column.header}...`}
              value={
                (table
                  .getColumn(column.accessorKey)
                  ?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table
                  .getColumn(column.accessorKey)
                  ?.setFilterValue(event.target.value)
              }
            />
          </div>
        ))}
      </div> */}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Vorherige Seite
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Nächste Seite
        </Button>
      </div>
    </div>
  )
}
