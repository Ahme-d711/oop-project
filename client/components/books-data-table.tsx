"use client"

import * as React from "react"
import { motion } from "motion/react"
import { IconBook, IconBookmark, IconCheck, IconTrash, IconEdit, IconEye, IconLoader } from "@tabler/icons-react"
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
import { Book, deleteBook } from "@/lib/api"
import { handleApiError } from "@/lib/errors"
import { AddBookDialog } from "@/components/add-book-dialog"
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
  onRefresh?: () => void
}

function ActionsCell({ book, table }: { book: Book; table: TanStackTable<Book> }) {
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteBook(book.id)
      toast.success("تم حذف الكتاب بنجاح")
      setOpen(false)
      // Refresh the table data
      const tableProps = table.options.meta as TableMeta
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

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" title="عرض التفاصيل">
        <IconEye className="size-4" />
      </Button>
      <Button variant="ghost" size="sm" title="تعديل">
        <IconEdit className="size-4" />
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={!book.isAvailable}
            title={!book.isAvailable ? "لا يمكن حذف كتاب مستعار" : "حذف"}
            className="text-destructive hover:text-destructive"
          >
            <IconTrash className="size-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف كتاب &quot;{book.title}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
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

const columns: ColumnDef<Book>[] = [
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
    accessorKey: "title",
    header: "العنوان",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <IconBook className="size-4 text-muted-foreground" />
        <div className="font-medium max-w-[200px] truncate" title={row.getValue("title") as string}>
          {row.getValue("title")}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "author",
    header: "المؤلف",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[150px] truncate" title={row.getValue("author") as string}>
        {row.getValue("author")}
      </div>
    ),
  },
  {
    accessorKey: "isAvailable",
    header: "الحالة",
    cell: ({ row }) => {
      const isAvailable = row.getValue("isAvailable") as boolean
      return (
        <Badge variant={isAvailable ? "default" : "secondary"}>
          {isAvailable ? (
            <>
              <IconCheck className="size-3 mr-1" />
              متاحة
            </>
          ) : (
            <>
              <IconBookmark className="size-3 mr-1" />
              مستعارة
            </>
          )}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      const isAvailable = row.getValue(id) as boolean
      if (value === "available") return isAvailable
      if (value === "borrowed") return !isAvailable
      return true
    },
  },
  {
    accessorKey: "borrowedByMemberId",
    header: "مستعارة من قبل",
    cell: ({ row }) => {
      const memberId = row.getValue("borrowedByMemberId") as string | undefined
      return (
        <div className="text-muted-foreground text-sm">
          {memberId ? (
            <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
              {memberId.substring(0, 8)}...
            </span>
          ) : (
            "—"
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "الإجراءات",
    cell: ({ row, table }) => {
      const book = row.original
      return <ActionsCell book={book} table={table} />
    },
  },
]

interface BooksDataTableProps {
  data: Book[]
  onRefresh?: () => void
  isLoading?: boolean
}

export function BooksDataTable({ data, onRefresh, isLoading = false }: BooksDataTableProps) {
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
    },
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mx-5">
      <CardHeader dir="rtl">
        <CardTitle>مجموعة الكتب</CardTitle>
        <CardDescription>
          إدارة مجموعة الكتب في المكتبة وتتبع حالة الإتاحة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center py-4">
          <Input
            placeholder="البحث في الكتب..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            disabled={isLoading}
          />
          <div className="ml-auto flex items-center gap-2">
            <AddBookDialog onBookAdded={onRefresh} />
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
                      "لم يتم العثور على كتب."
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
    </motion.div>
  )
}
