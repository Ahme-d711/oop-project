"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { BooksDataTable } from "@/components/books-data-table"
import { AddBookDialog } from "@/components/add-book-dialog"
import { BookSearchFilter } from "@/components/book-search-filter"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconBook, IconPlus, IconRefresh } from "@tabler/icons-react"

import { getBooks, searchBooks, Book } from "@/lib/api"
import { toast } from "sonner"

export default function BooksPage() {
  const [books, setBooks] = React.useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = React.useState<Book[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"all" | "available" | "borrowed">("all")

  const fetchBooks = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getBooks()
      setBooks(data)
      setFilteredBooks(data)
    } catch (error) {
      console.error("Failed to fetch books:", error)
      toast.error("فشل في تحميل الكتب")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSearch = React.useCallback(async (term: string) => {
    setSearchTerm(term)
    if (term.trim() === "") {
      setFilteredBooks(books)
      return
    }

    try {
      const searchResults = await searchBooks(term)
      setFilteredBooks(searchResults)
    } catch (error) {
      console.error("Search failed:", error)
      toast.error("فشل في البحث")
    }
  }, [books])

  const handleStatusFilter = React.useCallback((status: "all" | "available" | "borrowed") => {
    setStatusFilter(status)
    let filtered = books

    if (status === "available") {
      filtered = books.filter(book => book.isAvailable)
    } else if (status === "borrowed") {
      filtered = books.filter(book => !book.isAvailable)
    }

    setFilteredBooks(filtered)
  }, [books])

  React.useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const stats = React.useMemo(() => {
    const total = books.length
    const available = books.filter(book => book.isAvailable).length
    const borrowed = total - available
    
    return { total, available, borrowed }
  }, [books])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل الكتب...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-6 p-4 lg:p-6">
            {/* Header Section */}
            <div dir="rtl" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">إدارة الكتب</h1>
                <p className="text-muted-foreground">
                  إدارة مجموعة الكتب في المكتبة
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={fetchBooks} variant="outline" size="sm">
                  <IconRefresh className="size-4 mr-2" />
                  تحديث
                </Button>
                <AddBookDialog onBookAdded={fetchBooks} />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card dir="rtl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الكتب</CardTitle>
                  <IconBook className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    جميع الكتب في المكتبة
                  </p>
                </CardContent>
              </Card>
              <Card dir="rtl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الكتب المتاحة</CardTitle>
                  <IconBook className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.available}</div>
                  <p className="text-xs text-muted-foreground">
                    متاحة للاستعارة
                  </p>
                </CardContent>
              </Card>
              <Card dir="rtl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الكتب المستعارة</CardTitle>
                  <IconBook className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.borrowed}</div>
                  <p className="text-xs text-muted-foreground">
                    مستعارة حالياً
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <BookSearchFilter
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onSearch={handleSearch}
              onStatusFilter={handleStatusFilter}
              totalResults={filteredBooks.length}
              isLoading={isLoading}
            />

            {/* Books Table */}
            <BooksDataTable 
              data={filteredBooks} 
              onRefresh={fetchBooks}
              isLoading={isLoading}
            />
          </div>
        </div>
      </SidebarInset>
      <AppSidebar variant="inset" />
    </SidebarProvider>
  )
}
