"use client"

import * as React from "react"
import { IconBook, IconLoader } from "@tabler/icons-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createBook } from "@/lib/api"
import { toast } from "sonner"

const bookFormSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب").max(100, "يجب أن يكون العنوان أقل من 100 حرف"),
  author: z.string().min(1, "المؤلف مطلوب").max(100, "يجب أن يكون اسم المؤلف أقل من 100 حرف"),
})

type BookFormValues = z.infer<typeof bookFormSchema>

interface AddBookDialogProps {
  onBookAdded?: () => void
  trigger?: React.ReactNode
}

export function AddBookDialog({ onBookAdded, trigger }: AddBookDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
    },
  })

  const onSubmit = async (data: BookFormValues) => {
    setIsLoading(true)
    try {
      await createBook(data)
      toast.success("تم إضافة الكتاب بنجاح!")
      form.reset()
      setOpen(false)
      onBookAdded?.()
    } catch (error) {
      toast.error("فشل في إضافة الكتاب. يرجى المحاولة مرة أخرى.")
      console.error("Error adding book:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <IconBook className="size-4 mr-2" />
            إضافة كتاب
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة كتاب جديد</DialogTitle>
          <DialogDescription>
            إضافة كتاب جديد إلى مجموعة المكتبة. املأ معلومات العنوان والمؤلف.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل عنوان الكتاب" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المؤلف</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم المؤلف" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <IconLoader className="size-4 mr-2 animate-spin" />}
                إضافة كتاب
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
