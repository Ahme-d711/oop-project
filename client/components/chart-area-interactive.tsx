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

// Generate realistic library usage data over time with more detail
const generateLibraryData = (stats: LibraryStats) => {
  const data = []
  const today = new Date()
  const totalBooks = stats.totalBooks || 10
  const baseBorrowed = Math.max(0, stats.borrowedBooks || 2)
  
  // Generate 90 days of data for better visualization
  const daysToGenerate = 90
  
  for (let i = daysToGenerate - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const dayOfWeek = date.getDay()
    const dayOfMonth = date.getDate()
    const monthProgress = i / daysToGenerate // 0 to 1 over the period
    
    // Weekend effect: more borrowing on weekends (Friday-Saturday in Arabic context)
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0
    const weekendBoost = isWeekend ? 1.3 : 0.9
    
    // Monthly pattern: higher activity in middle of month
    const monthPattern = 1 + (Math.sin((dayOfMonth / 30) * Math.PI * 2) * 0.15)
    
    // Gradual trend: borrowing increases over time with some fluctuations
    const trendFactor = 1 + (monthProgress * 0.4) + (Math.sin(monthProgress * Math.PI * 4) * 0.1)
    
    // Weekly pattern: mid-week peak
    const weeklyPattern = 1 + (Math.sin((dayOfWeek / 7) * Math.PI * 2) * 0.2)
    
    // Random variation with smoother transitions
    const randomVariation = (Math.random() * 0.3 - 0.15) // ±15%
    
    // Occasional spikes (special events, exams, etc.)
    const spikeChance = Math.random()
    const spikeMultiplier = spikeChance > 0.95 ? 1.5 : spikeChance > 0.90 ? 1.3 : 1.0
    
    // Calculate borrowed books with all factors
    const borrowed = Math.max(0, Math.min(
      totalBooks - 1,
      Math.round(
        baseBorrowed * 
        trendFactor * 
        weekendBoost * 
        monthPattern * 
        weeklyPattern * 
        spikeMultiplier * 
        (1 + randomVariation)
      )
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
  const baseBorrowed = 3
  
  // Generate 90 days of data for better visualization
  const daysToGenerate = 90
  
  for (let i = daysToGenerate - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const dayOfWeek = date.getDay()
    const dayOfMonth = date.getDate()
    const monthProgress = i / daysToGenerate
    
    // Weekend effect: more borrowing on weekends
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0
    const weekendBoost = isWeekend ? 1.35 : 0.85
    
    // Monthly pattern: higher activity in middle of month
    const monthPattern = 1 + (Math.sin((dayOfMonth / 30) * Math.PI * 2) * 0.2)
    
    // Gradual trend with fluctuations
    const trendFactor = 1 + (monthProgress * 0.5) + (Math.sin(monthProgress * Math.PI * 3) * 0.15)
    
    // Weekly pattern: mid-week peak
    const weeklyPattern = 1 + (Math.sin((dayOfWeek / 7) * Math.PI * 2) * 0.25)
    
    // Random variation
    const randomVariation = (Math.random() * 0.35 - 0.175)
    
    // Occasional spikes for realism
    const spikeChance = Math.random()
    const spikeMultiplier = spikeChance > 0.96 ? 1.6 : spikeChance > 0.92 ? 1.4 : 1.0
    
    const borrowed = Math.max(0, Math.min(
      totalBooks - 1,
      Math.round(
        baseBorrowed * 
        trendFactor * 
        weekendBoost * 
        monthPattern * 
        weeklyPattern * 
        spikeMultiplier * 
        (1 + randomVariation)
      )
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
    color: "hsl(142, 76%, 36%)", // Green color for available books
  },
  borrowed: {
    label: "مستعارة",
    color: "hsl(24, 95%, 53%)", // Orange color for borrowed books
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
                  stopColor="hsl(142, 76%, 36%)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(142, 76%, 36%)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillBorrowed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(24, 95%, 53%)"
                  stopOpacity={0.9}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(24, 95%, 53%)"
                  stopOpacity={0.15}
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
              stroke="hsl(24, 95%, 53%)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="available"
              type="natural"
              fill="url(#fillAvailable)"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
    </motion.div>
  )
}
