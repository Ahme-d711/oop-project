"use client"

import * as React from "react"
import { IconUsers, IconSchool, IconUser, IconMail, IconId, IconEye, IconEdit, IconLoader, IconTrash } from "@tabler/icons-react"
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
  Table as TanStackTable,
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
import { Member, Book, deleteMember } from "@/lib/api"
import { handleApiError } from "@/lib/errors"
import { MEMBER_TYPES } from "@/lib/constants"
import { AddMemberDialog } from "@/components/add-member-dialog"
import { MemberDetailsDialog } from "@/components/member-details-dialog"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TableMeta {
  books?: Book[]
  onRefresh?: () => void
}

function ActionsCell({ member, table, books }: { member: Member; table: TanStackTable<Member>; books: Book[] }) {
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const tableProps = table.options.meta as TableMeta

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteMember(member.id)
      toast.success("تم حذف العضو بنجاح")
      setOpen(false)
      // Refresh the table data
      if (tableProps?.onRefresh) {
        tableProps.onRefresh()
      }
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast.error(errorMessage)
      console.error("Delete failed:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  // Check if member has borrowed books
  const hasBorrowedBooks = books.some(
    book => !book.isAvailable && book.borrowedByMemberId === member.id
  ) || false

  return (
    <div className="flex items-center gap-1">
      <MemberDetailsDialog
        member={member}
        books={books}
        trigger={
          <Button variant="ghost" size="sm" title="عرض التفاصيل">
            <IconEye className="size-4" />
          </Button>
        }
      />
      <Button variant="ghost" size="sm" title="تعديل">
        <IconEdit className="size-4" />
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={hasBorrowedBooks}
            title={hasBorrowedBooks ? "لا يمكن حذف عضو لديه كتب مستعارة" : "حذف"}
            className="text-destructive hover:text-destructive"
          >
            <IconTrash className="size-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف العضو &quot;{member.name}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <IconLoader className="size-4 mr-2 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                "حذف"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

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
        aria-label="تحديد الكل"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="تحديد الصف"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "الاسم",
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
    header: "البريد الإلكتروني",
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
    header: "النوع",
    cell: ({ row }) => {
      const memberType = row.getValue("memberType") as Member['memberType']
      const isStudent = memberType === MEMBER_TYPES.STUDENT
      
      return (
        <Badge variant={isStudent ? "default" : "secondary"}>
          {isStudent ? (
            <>
              <IconSchool className="size-3 mr-1" />
              طالب
            </>
          ) : (
            <>
              <IconUser className="size-3 mr-1" />
              مدرس
            </>
          )}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      const memberType = row.getValue(id) as Member['memberType']
      if (value === MEMBER_TYPES.STUDENT) return memberType === MEMBER_TYPES.STUDENT
      if (value === MEMBER_TYPES.TEACHER) return memberType === MEMBER_TYPES.TEACHER
      return true
    },
  },
  {
    accessorKey: "idNumber",
    header: "رقم الهوية",
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
    header: "الإجراءات",
    cell: ({ row, table }) => {
      const member = row.original
      const tableProps = table.options.meta as TableMeta
      return <ActionsCell member={member} table={table} books={tableProps?.books || []} />
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
      <CardHeader dir="rtl">
        <CardTitle>قائمة الأعضاء</CardTitle>
        <CardDescription>
          إدارة أعضاء المكتبة وتتبع معلوماتهم
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center py-4">
          <Input
            placeholder="البحث في الأعضاء..."
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
                        جاري التحميل...
                      </div>
                    ) : (
                      "لم يتم العثور على أعضاء."
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            تم تحديد {table.getFilteredSelectedRowModel().rows.length} من{" "}
            {table.getFilteredRowModel().rows.length} صف.
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
            >
              التالي
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
