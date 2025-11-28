"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { MembersDataTable } from "@/components/members-data-table"
import { AddMemberDialog } from "@/components/add-member-dialog"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconUsers, IconRefresh, IconSchool, IconUser } from "@tabler/icons-react"

import { getMembers, getBooks, Member, Book } from "@/lib/api"
import { toast } from "sonner"

export default function MembersPage() {
  const [members, setMembers] = React.useState<Member[]>([])
  const [books, setBooks] = React.useState<Book[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchData = React.useCallback(async () => {
    try {
      setIsLoading(true)
      const [membersData, booksData] = await Promise.all([
        getMembers(),
        getBooks()
      ])
      setMembers(membersData)
      setBooks(booksData)
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
    const total = members.length
    const students = members.filter(member => member.memberType === 'student').length
    const teachers = members.filter(member => member.memberType === 'teacher').length
    
    return { total, students, teachers }
  }, [members])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل الأعضاء...</p>
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
                <h1 className="text-2xl font-bold tracking-tight">إدارة الأعضاء</h1>
                <p className="text-muted-foreground">
                  إدارة أعضاء المكتبة بما في ذلك الطلاب والمدرسين
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={fetchData} variant="outline" size="sm">
                  <IconRefresh className="size-4 mr-2" />
                  تحديث
                </Button>
                <AddMemberDialog onMemberAdded={fetchData} />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card dir="rtl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الأعضاء</CardTitle>
                  <IconUsers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    جميع أعضاء المكتبة
                  </p>
                </CardContent>
              </Card>
              <Card dir="rtl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الطلاب</CardTitle>
                  <IconSchool className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.students}</div>
                  <p className="text-xs text-muted-foreground">
                    أعضاء طلاب
                  </p>
                </CardContent>
              </Card>
              <Card dir="rtl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">المدرسون</CardTitle>
                  <IconUser className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{stats.teachers}</div>
                  <p className="text-xs text-muted-foreground">
                    أعضاء مدرسون
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Members Table */}
            <MembersDataTable 
              data={members} 
              onRefresh={fetchData}
              isLoading={isLoading}
              books={books}
            />
          </div>
        </div>
      </SidebarInset>
      <AppSidebar variant="inset" />
    </SidebarProvider>
  )
}
