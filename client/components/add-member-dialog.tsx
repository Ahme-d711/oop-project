"use client"

import * as React from "react"
import { IconUserPlus, IconLoader } from "@tabler/icons-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { registerMember } from "@/lib/api"
import { handleApiError } from "@/lib/errors"
import { MEMBER_TYPES } from "@/lib/constants"
import { toast } from "sonner"

const memberFormSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب").max(100, "يجب أن يكون الاسم أقل من 100 حرف"),
  email: z.string().email("عنوان بريد إلكتروني غير صحيح"),
  memberType: z.enum([MEMBER_TYPES.STUDENT, MEMBER_TYPES.TEACHER], {
    message: "نوع العضو مطلوب",
  }),
  idNumber: z.string().min(1, "رقم الهوية مطلوب").max(20, "يجب أن يكون رقم الهوية أقل من 20 حرف"),
})

type MemberFormValues = z.infer<typeof memberFormSchema>

interface AddMemberDialogProps {
  onMemberAdded?: () => void
}

export function AddMemberDialog({ onMemberAdded }: AddMemberDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      name: "",
      email: "",
      memberType: undefined,
      idNumber: "",
    },
  })

  const onSubmit = async (data: MemberFormValues) => {
    setIsLoading(true)
    try {
      await registerMember(data)
      toast.success("تم إضافة العضو بنجاح!")
      form.reset()
      setOpen(false)
      onMemberAdded?.()
    } catch (error) {
      const errorMessage = handleApiError(error)
      toast.error(errorMessage)
      console.error("Error adding member:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <IconUserPlus className="size-4 mr-2" />
          إضافة عضو
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة عضو جديد</DialogTitle>
          <DialogDescription>
            إضافة عضو جديد إلى المكتبة. املأ معلومات العضو أدناه.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الكامل</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل الاسم الكامل" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="أدخل عنوان البريد الإلكتروني" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="memberType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع العضو</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع العضو" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={MEMBER_TYPES.STUDENT}>طالب</SelectItem>
                      <SelectItem value={MEMBER_TYPES.TEACHER}>مدرس</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهوية</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل رقم الهوية" {...field} />
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
                إضافة عضو
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
