"use client"

import * as React from "react"
import { motion } from "motion/react"
import { IconTrendingDown, IconTrendingUp, IconBook, IconUsers, IconBookmark, IconUserCheck } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface LibraryStats {
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  totalMembers: number;
  studentMembers: number;
  teacherMembers: number;
}

export function SectionCards({ libraryStats }: { libraryStats: LibraryStats }) {
  const availabilityRate = libraryStats.totalBooks > 0 
    ? ((libraryStats.availableBooks / libraryStats.totalBooks) * 100).toFixed(1)
    : "0";
  
  const borrowRate = libraryStats.totalBooks > 0 
    ? ((libraryStats.borrowedBooks / libraryStats.totalBooks) * 100).toFixed(1)
    : "0";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
    >
      <motion.div variants={cardVariants}>
        <Card dir="rtl" className="@container/card">
        <CardHeader>
          <CardDescription>إجمالي الكتب</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {libraryStats.totalBooks}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconBook />
              مجموعة المكتبة
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            متاحة: {libraryStats.availableBooks} <IconBook className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {availabilityRate}% معدل الإتاحة
          </div>
        </CardFooter>
      </Card>
      </motion.div>
      <motion.div variants={cardVariants}>
        <Card dir="rtl" className="@container/card">
        <CardHeader>
          <CardDescription>الكتب المستعارة</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {libraryStats.borrowedBooks}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconBookmark />
              مستعارة حالياً
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {borrowRate}% من المجموعة <IconBookmark className="size-4" />
          </div>
          <div className="text-muted-foreground">
            الكتب المستعارة حالياً
          </div>
        </CardFooter>
      </Card>
      </motion.div>
      <motion.div variants={cardVariants}>
        <Card dir="rtl" className="@container/card">
        <CardHeader>
          <CardDescription>إجمالي الأعضاء</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {libraryStats.totalMembers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUsers />
              الأعضاء النشطون
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            الطلاب: {libraryStats.studentMembers} <IconUsers className="size-4" />
          </div>
          <div className="text-muted-foreground">المدرسون: {libraryStats.teacherMembers}</div>
        </CardFooter>
      </Card>
      </motion.div>
      <motion.div variants={cardVariants}>
        <Card dir="rtl" className="@container/card">
        <CardHeader>
          <CardDescription>استخدام المكتبة</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {borrowRate}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUserCheck />
              الاستخدام
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            الكتب قيد التداول <IconUserCheck className="size-4" />
          </div>
          <div className="text-muted-foreground">معدل استخدام المجموعة</div>
        </CardFooter>
      </Card>
      </motion.div>
    </motion.div>
  )
}
