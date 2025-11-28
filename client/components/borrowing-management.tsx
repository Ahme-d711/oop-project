"use client"

import * as React from "react"
import { IconBookmark, IconBook, IconUsers, IconArrowRight, IconArrowLeft, IconLoader, IconCheck, IconX } from "@tabler/icons-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

import { Book, Member, borrowBook, returnBook } from "@/lib/api"
import { toast } from "sonner"

const borrowFormSchema = z.object({
  bookId: z.string().min(1, "يرجى اختيار كتاب"),
  memberId: z.string().min(1, "يرجى اختيار عضو"),
})

const returnFormSchema = z.object({
  bookId: z.string().min(1, "يرجى اختيار كتاب"),
  memberId: z.string().min(1, "يرجى اختيار عضو"),
})

type BorrowFormValues = z.infer<typeof borrowFormSchema>
type ReturnFormValues = z.infer<typeof returnFormSchema>

interface BorrowingManagementProps {
  books: Book[]
  members: Member[]
  onRefresh?: () => void
  isLoading?: boolean
}

export function BorrowingManagement({ 
  books, 
  members, 
  onRefresh, 
  isLoading = false 
}: BorrowingManagementProps) {
  const [isBorrowing, setIsBorrowing] = React.useState(false)
  const [isReturning, setIsReturning] = React.useState(false)

  const borrowForm = useForm<BorrowFormValues>({
    resolver: zodResolver(borrowFormSchema),
    defaultValues: {
      bookId: "",
      memberId: "",
    },
  })

  const returnForm = useForm<ReturnFormValues>({
    resolver: zodResolver(returnFormSchema),
    defaultValues: {
      bookId: "",
      memberId: "",
    },
  })

  const availableBooks = React.useMemo(() => 
    books.filter(book => book.isAvailable), [books]
  )

  const borrowedBooks = React.useMemo(() => 
    books.filter(book => !book.isAvailable), [books]
  )

  const onBorrowSubmit = async (data: BorrowFormValues) => {
    setIsBorrowing(true)
    try {
      await borrowBook(data)
      toast.success("تم استعارة الكتاب بنجاح!")
      borrowForm.reset()
      onRefresh?.()
    } catch (error) {
      toast.error("فشل في استعارة الكتاب. يرجى المحاولة مرة أخرى.")
      console.error("Error borrowing book:", error)
    } finally {
      setIsBorrowing(false)
    }
  }

  const onReturnSubmit = async (data: ReturnFormValues) => {
    setIsReturning(true)
    try {
      await returnBook(data)
      toast.success("تم إرجاع الكتاب بنجاح!")
      returnForm.reset()
      onRefresh?.()
    } catch (error) {
      toast.error("فشل في إرجاع الكتاب. يرجى المحاولة مرة أخرى.")
      console.error("Error returning book:", error)
    } finally {
      setIsReturning(false)
    }
  }

  const getBookTitle = (bookId: string) => {
    const book = books.find(b => b.id === bookId)
    return book ? book.title : bookId
  }

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId)
    return member ? member.name : memberId
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Borrow Book Section */}
      <Card dir="rtl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBookmark className="size-5" />
            استعارة كتاب
          </CardTitle>
          <CardDescription>
            اختر كتاباً وعضواً لإجراء عملية الاستعارة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...borrowForm}>
            <form onSubmit={borrowForm.handleSubmit(onBorrowSubmit)} className="space-y-4">
              <FormField
                control={borrowForm.control}
                name="bookId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الكتاب</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر كتاباً متاحاً" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableBooks.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            لا توجد كتب متاحة
                          </div>
                        ) : (
                          availableBooks.map((book) => (
                            <SelectItem key={book.id} value={book.id}>
                              <div className="flex items-center gap-2">
                                <IconBook className="size-4" />
                                <span>{book.title} - {book.author}</span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={borrowForm.control}
                name="memberId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العضو</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر عضواً" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            لا يوجد أعضاء مسجلون
                          </div>
                        ) : (
                          members.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              <div className="flex items-center gap-2">
                                <IconUsers className="size-4" />
                                <span>{member.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {member.memberType === 'student' ? 'طالب' : 'مدرس'}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isBorrowing || isLoading || availableBooks.length === 0}
                className="w-full"
              >
                {isBorrowing && <IconLoader className="size-4 mr-2 animate-spin" />}
                <IconArrowRight className="size-4 mr-2" />
                استعارة الكتاب
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Return Book Section */}
      <Card dir="rtl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconArrowLeft className="size-5" />
            إرجاع كتاب
          </CardTitle>
          <CardDescription>
            اختر كتاباً مستعاراً وعضواً لإجراء عملية الإرجاع
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...returnForm}>
            <form onSubmit={returnForm.handleSubmit(onReturnSubmit)} className="space-y-4">
              <FormField
                control={returnForm.control}
                name="bookId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الكتاب المستعار</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر كتاباً مستعاراً" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {borrowedBooks.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            لا توجد كتب مستعارة
                          </div>
                        ) : (
                          borrowedBooks.map((book) => (
                            <SelectItem key={book.id} value={book.id}>
                              <div className="flex items-center gap-2">
                                <IconBookmark className="size-4" />
                                <span>{book.title} - {book.author}</span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={returnForm.control}
                name="memberId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العضو</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر العضو المستعير" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            لا يوجد أعضاء مسجلون
                          </div>
                        ) : (
                          members.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              <div className="flex items-center gap-2">
                                <IconUsers className="size-4" />
                                <span>{member.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {member.memberType === 'student' ? 'طالب' : 'مدرس'}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isReturning || isLoading || borrowedBooks.length === 0}
                className="w-full"
                variant="outline"
              >
                {isReturning && <IconLoader className="size-4 mr-2 animate-spin" />}
                <IconArrowLeft className="size-4 mr-2" />
                إرجاع الكتاب
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Currently Borrowed Books */}
      <Card className="lg:col-span-2">
        <CardHeader dir="rtl">
          <CardTitle className="flex items-center gap-2">
            <IconBookmark className="size-5" />
            الكتب المستعارة حالياً
          </CardTitle>
          <CardDescription>
            قائمة بجميع الكتب المستعارة في الوقت الحالي
          </CardDescription>
        </CardHeader>
        <CardContent>
          {borrowedBooks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <IconCheck className="size-12 mx-auto mb-4 text-green-500" />
              <p>لا توجد كتب مستعارة حالياً</p>
              <p className="text-sm">جميع الكتب متاحة للاستعارة</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الكتاب</TableHead>
                    <TableHead>المؤلف</TableHead>
                    <TableHead>مستعار من قبل</TableHead>
                    <TableHead>نوع العضو</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowedBooks.map((book) => {
                    const member = members.find(m => m.id === book.borrowedByMemberId)
                    return (
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
                        <TableCell>
                          {member ? member.name : 'غير معروف'}
                        </TableCell>
                        <TableCell>
                          {member && (
                            <Badge variant={member.memberType === 'student' ? 'default' : 'secondary'}>
                              {member.memberType === 'student' ? 'طالب' : 'مدرس'}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
