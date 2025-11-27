"use client"

import * as React from "react"
import { IconUser, IconMail, IconId, IconCalendar, IconBook, IconBookmark } from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Member, Book, getBorrowedBooks } from "@/lib/api"

interface MemberDetailsDialogProps {
  member: Member
  trigger: React.ReactNode
  books?: Book[]
}

export function MemberDetailsDialog({ member, trigger, books = [] }: MemberDetailsDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [borrowedBooks, setBorrowedBooks] = React.useState<Book[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const fetchBorrowedBooks = React.useCallback(async () => {
    if (!open) return
    
    setIsLoading(true)
    try {
      const borrowed = await getBorrowedBooks(member.id)
      setBorrowedBooks(borrowed)
    } catch (error) {
      console.error("Failed to fetch borrowed books:", error)
      // Fallback: filter from provided books
      const memberBorrowedBooks = books.filter(book => 
        !book.isAvailable && book.borrowedByMemberId === member.id
      )
      setBorrowedBooks(memberBorrowedBooks)
    } finally {
      setIsLoading(false)
    }
  }, [member.id, books, open])

  React.useEffect(() => {
    fetchBorrowedBooks()
  }, [fetchBorrowedBooks])

  const memberTypeLabel = member.memberType === 'student' ? 'طالب' : 'مدرس'
  const memberTypeColor = member.memberType === 'student' ? 'blue' : 'purple'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconUser className="size-5" />
            تفاصيل العضو
          </DialogTitle>
          <DialogDescription>
            معلومات مفصلة عن العضو وسجل الاستعارة
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Member Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">المعلومات الشخصية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <IconUser className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">الاسم</p>
                    <p className="font-medium">{member.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <IconMail className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                    <p className="font-medium">{member.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <IconId className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">رقم الهوية</p>
                    <p className="font-mono text-sm bg-muted px-2 py-1 rounded">
                      {member.idNumber}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="size-4" />
                  <div>
                    <p className="text-sm text-muted-foreground">نوع العضوية</p>
                    <Badge 
                      variant={member.memberType === 'student' ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {memberTypeLabel}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Borrowing Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إحصائيات الاستعارة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <IconBookmark className="size-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-2xl font-bold text-orange-600">{borrowedBooks.length}</p>
                  <p className="text-sm text-muted-foreground">كتب مستعارة حالياً</p>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <IconBook className="size-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold text-blue-600">-</p>
                  <p className="text-sm text-muted-foreground">إجمالي الاستعارات</p>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <IconCalendar className="size-8 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold text-green-600">-</p>
                  <p className="text-sm text-muted-foreground">كتب متأخرة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Currently Borrowed Books */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">الكتب المستعارة حالياً</CardTitle>
              <CardDescription>
                قائمة بالكتب التي استعارها العضو ولم يتم إرجاعها بعد
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">جاري التحميل...</p>
                </div>
              ) : borrowedBooks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <IconBook className="size-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد كتب مستعارة حالياً</p>
                  <p className="text-sm">العضو لم يستعر أي كتب في الوقت الحالي</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>العنوان</TableHead>
                        <TableHead>المؤلف</TableHead>
                        <TableHead>تاريخ الاستعارة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {borrowedBooks.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <IconBook className="size-4 text-muted-foreground" />
                              {book.title}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {book.author}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            -
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
