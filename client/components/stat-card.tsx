"use client"

import { LucideIcon } from "lucide-react"
import { Icon } from "@tabler/icons-react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: Icon | LucideIcon
  iconColor?: string
  valueColor?: string
  badge?: {
    label: string
    icon?: Icon | LucideIcon
    variant?: "default" | "secondary" | "outline" | "destructive"
  }
  footer?: React.ReactNode
  className?: string
  dir?: "rtl" | "ltr"
}

/**
 * Reusable Stat Card Component
 * Displays statistics with title, value, icon, and optional description
 */
export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  valueColor,
  badge,
  footer,
  className,
  dir = "rtl",
}: StatCardProps) {
  return (
    <Card dir={dir} className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <Icon className={cn("h-4 w-4", iconColor || "text-muted-foreground")} />
        )}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueColor)}>
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {badge && (
          <div className="mt-2">
            <Badge variant={badge.variant || "outline"} className="gap-1">
              {badge.icon && <badge.icon className="size-3" />}
              {badge.label}
            </Badge>
          </div>
        )}
      </CardContent>
      {footer && <CardFooter className="pt-2">{footer}</CardFooter>}
    </Card>
  )
}

