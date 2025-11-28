"use client"

import * as React from "react"
import { motion } from "motion/react"
import { LucideIcon } from "lucide-react"
import { Icon } from "@tabler/icons-react"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface StatCardWithMotionProps {
  value: string | number
  description?: string
  badge?: {
    label: string
    icon?: Icon | LucideIcon
    variant?: "default" | "secondary" | "outline" | "destructive"
  }
  footer?: React.ReactNode
  className?: string
  dir?: "rtl" | "ltr"
  variants?: {
    hidden: { opacity: number; y: number }
    visible: { opacity: number; y: number; transition: { duration: number; ease: readonly [number, number, number, number] } }
  }
}

/**
 * Stat Card with Motion Animation
 * Used in dashboard section cards with animations
 */
export function StatCardWithMotion({
  value,
  description,
  badge,
  footer,
  className,
  dir = "rtl",
  variants,
}: StatCardWithMotionProps) {
  const defaultVariants = {
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

  const cardVariants = variants || defaultVariants

  return (
    <motion.div variants={cardVariants}>
      <Card dir={dir} className={cn("@container/card", className)}>
        <CardHeader>
          {description && <CardDescription>{description}</CardDescription>}
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {value}
          </CardTitle>
          {badge && (
            <CardAction>
              <Badge variant={badge.variant || "outline"}>
                {badge.icon && <badge.icon />}
                {badge.label}
              </Badge>
            </CardAction>
          )}
        </CardHeader>
        {footer && (
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {footer}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}

