"use client"

import * as React from "react"
import { IconUsers, IconSchool, IconUser, IconMail, IconId, IconEye, IconEdit, IconLoader } from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Member, Book } from "@/lib/api"
import { AddMemberDialog } from "@/components/add-member-dialog"
import { MemberDetailsDialog } from "@/components/member-details-dialog"

const columns: ColumnDef<Member>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <IconUsers className="size-4 text-muted-foreground" />
        <div className="font-medium max-w-[200px] truncate" title={row.getValue("name") as string}>
          {row.getValue("name")}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <IconMail className="size-4 text-muted-foreground" />
        <div className="text-muted-foreground max-w-[200px] truncate" title={row.getValue("email") as string}>
          {row.getValue("email")}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "memberType",
    header: "Type",
    cell: ({ row }) => {
      const memberType = row.getValue("memberType") as string
      const isStudent = memberType === "student"
      
      return (
        <Badge variant={isStudent ? "default" : "secondary"}>
          {isStudent ? (
            <>
              <IconSchool className="size-3 mr-1" />
              Student
            </>
          ) : (
            <>
              <IconUser className="size-3 mr-1" />
              Teacher
            </>
          )}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      const memberType = row.getValue(id) as string
      if (value === "student") return memberType === "student"
      if (value === "teacher") return memberType === "teacher"
      return true
    },
  },
  {
    accessorKey: "idNumber",
    header: "ID Number",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <IconId className="size-4 text-muted-foreground" />
        <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
          {row.getValue("idNumber")}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const member = row.original
      const tableProps = table.options.meta as { books?: Book[]; onRefresh?: () => void }

      return (
        <div className="flex items-center gap-1">
          <MemberDetailsDialog
            member={member}
            books={tableProps?.books || []}
            trigger={
              <Button variant="ghost" size="sm" title="View Details">
                <IconEye className="size-4" />
              </Button>
            }
          />
          <Button variant="ghost" size="sm" title="Edit">
            <IconEdit className="size-4" />
          </Button>
        </div>
      )
    },
  },
]

interface MembersDataTableProps {
  data: Member[]
  onRefresh?: () => void
  isLoading?: boolean
  books?: Book[]
}

export function MembersDataTable({ data, onRefresh, isLoading = false, books = [] }: MembersDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      onRefresh,
      books,
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members List</CardTitle>
        <CardDescription>
          Manage library members and track their information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center py-4">
          <Input
            placeholder="Search members..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            disabled={isLoading}
          />
          <div className="ml-auto flex items-center gap-2">
            <AddMemberDialog onMemberAdded={onRefresh} />
          </div>
        </div>
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
                    data-state={row.getIsSelected() && "selected"}
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
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <IconLoader className="size-4 animate-spin" />
                        Loading...
                      </div>
                    ) : (
                      "No members found."
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
