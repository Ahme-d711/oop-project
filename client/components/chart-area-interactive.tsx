"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "تحليلات استخدام المكتبة"

interface LibraryStats {
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  totalMembers: number;
  studentMembers: number;
  teacherMembers: number;
}

// Generate sample library usage data over time
const generateLibraryData = (stats: LibraryStats) => {
  const data = []
  const today = new Date()
  const totalBooks = stats.totalBooks || 10
  const baseAvailable = Math.max(3, stats.availableBooks || 5)
  const baseBorrowed = Math.max(0, stats.borrowedBooks || 2)
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Create realistic variation with smooth trends
    const dayOfWeek = date.getDay()
    const weekProgress = (29 - i) / 29 // 0 to 1 over the period
    
    // Weekend effect: more borrowing on weekends
    const weekendBoost = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.2 : 1.0
    
    // Gradual trend: borrowing increases slightly over time
    const trendFactor = 1 + (weekProgress * 0.3)
    
    // Random variation
    const randomVariation = (Math.random() * 0.4 - 0.2) // ±20%
    
    // Calculate values with realistic patterns
    const borrowed = Math.max(0, Math.min(
      totalBooks - 1,
      Math.round(baseBorrowed * trendFactor * weekendBoost * (1 + randomVariation))
    ))
    
    const available = Math.max(1, totalBooks - borrowed)
    
    data.push({
      date: date.toISOString().split('T')[0],
      available,
      borrowed,
    })
  }
  
  return data
}

// Generate fallback chart data with realistic library usage patterns
const generateFallbackData = () => {
  const data = []
  const today = new Date()
  const totalBooks = 10
  const baseAvailable = 7
  const baseBorrowed = 3
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Create realistic variation
    const dayOfWeek = date.getDay()
    const weekProgress = (29 - i) / 29
    
    // Weekend effect: more borrowing on weekends
    const weekendBoost = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1.0
    
    // Gradual trend
    const trendFactor = 1 + (weekProgress * 0.2)
    
    // Random variation
    const randomVariation = (Math.random() * 0.4 - 0.2)
    
    const borrowed = Math.max(0, Math.min(
      totalBooks - 1,
      Math.round(baseBorrowed * trendFactor * weekendBoost * (1 + randomVariation))
    ))
    
    const available = Math.max(1, totalBooks - borrowed)
    
    data.push({
      date: date.toISOString().split('T')[0],
      available,
      borrowed,
    })
  }
  
  return data
}

const chartData = generateFallbackData()

const chartConfig = {
  books: {
    label: "الكتب",
  },
  available: {
    label: "متاحة",
    color: "hsl(var(--chart-1))",
  },
  borrowed: {
    label: "مستعارة",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ libraryStats }: { libraryStats?: LibraryStats }) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  
  // Use provided library stats or generate sample data
  const actualChartData = React.useMemo(() => {
    if (libraryStats) {
      return generateLibraryData(libraryStats)
    }
    return chartData
  }, [libraryStats])

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = actualChartData.filter((item) => {
    const date = new Date(item.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    
    return date >= startDate && date <= today
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card dir="rtl" className="@container/card">
      <CardHeader>
        <CardTitle>تحليلات استخدام المكتبة</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            اتجاهات إتاحة الكتب والاستعارة مع مرور الوقت
          </span>
          <span className="@[540px]/card:hidden">اتجاهات الكتب</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">آخر 3 أشهر</ToggleGroupItem>
            <ToggleGroupItem value="30d">آخر 30 يوم</ToggleGroupItem>
            <ToggleGroupItem value="7d">آخر 7 أيام</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="آخر 3 أشهر" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                آخر 3 أشهر
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                آخر 30 يوم
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                آخر 7 أيام
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillAvailable" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-available)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-available)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillBorrowed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-borrowed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-borrowed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="borrowed"
              type="natural"
              fill="url(#fillBorrowed)"
              stroke="var(--color-borrowed)"
              stackId="a"
            />
            <Area
              dataKey="available"
              type="natural"
              fill="url(#fillAvailable)"
              stroke="var(--color-available)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
    </motion.div>
  )
}
