"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { BorrowingManagement } from "@/components/borrowing-management"
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
import { IconBookmark, IconRefresh, IconBook, IconUsers, IconClock } from "@tabler/icons-react"

import { getBooks, getMembers, Book, Member } from "@/lib/api"
import { toast } from "sonner"

export default function BorrowingPage() {
  const [books, setBooks] = React.useState<Book[]>([])
  const [members, setMembers] = React.useState<Member[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchData = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const [booksData, membersData] = await Promise.all([
        getBooks(),
        getMembers()
      ])
      setBooks(booksData)
      setMembers(membersData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast.error("فشل في تحميل البيانات")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const stats = React.useMemo(() => {
    const availableBooks = books.filter(book => book.isAvailable).length
    const borrowedBooks = books.filter(book => !book.isAvailable).length
    const totalMembers = members.length
    
    return { availableBooks, borrowedBooks, totalMembers }
  }, [books, members])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل البيانات...</p>
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
                <h1 className="text-2xl font-bold tracking-tight">إدارة الاستعارة</h1>
                <p className="text-muted-foreground">
                  إدارة عمليات استعارة وإرجاع الكتب
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={fetchData} variant="outline" size="sm">
                  <IconRefresh className="size-4 mr-2" />
                  تحديث
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card dir="rtl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الكتب المتاحة</CardTitle>
                  <IconBook className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.availableBooks}</div>
                  <p className="text-xs text-muted-foreground">
                    متاحة للاستعارة
                  </p>
                </CardContent>
              </Card>
              <Card dir="rtl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الكتب المستعارة</CardTitle>
                  <IconBookmark className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.borrowedBooks}</div>
                  <p className="text-xs text-muted-foreground">
                    مستعارة حالياً
                  </p>
                </CardContent>
              </Card>
              <Card dir="rtl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الأعضاء</CardTitle>
                  <IconUsers className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalMembers}</div>
                  <p className="text-xs text-muted-foreground">
                    أعضاء مسجلون
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Borrowing Management Component */}
            <BorrowingManagement 
              books={books}
              members={members}
              onRefresh={fetchData}
              isLoading={isLoading}
            />
          </div>
        </div>
      </SidebarInset>
      <AppSidebar variant="inset" />
    </SidebarProvider>
  )
}
