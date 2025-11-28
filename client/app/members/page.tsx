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
import { Button } from "@/components/ui/button"
import { IconUsers, IconRefresh, IconSchool, IconUser } from "@tabler/icons-react"
import { StatCard } from "@/components/stat-card"

import { getMembers, getBooks, Member, Book } from "@/lib/api"
import { handleApiError } from "@/lib/errors"
import { MEMBER_TYPES } from "@/lib/constants"
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
      const errorMessage = handleApiError(error)
      console.error("Failed to fetch data:", error)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const stats = React.useMemo(() => {
    const total = members.length
    const students = members.filter(member => member.memberType === MEMBER_TYPES.STUDENT).length
    const teachers = members.filter(member => member.memberType === MEMBER_TYPES.TEACHER).length
    
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
              <StatCard
                title="إجمالي الأعضاء"
                value={stats.total}
                description="جميع أعضاء المكتبة"
                icon={IconUsers}
              />
              <StatCard
                title="الطلاب"
                value={stats.students}
                description="أعضاء طلاب"
                icon={IconSchool}
                iconColor="text-blue-600"
                valueColor="text-blue-600"
              />
              <StatCard
                title="المدرسون"
                value={stats.teachers}
                description="أعضاء مدرسون"
                icon={IconUser}
                iconColor="text-purple-600"
                valueColor="text-purple-600"
              />
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
