"use client"

import * as React from "react"
import { IconSearch, IconFilter, IconX } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BookSearchFilterProps {
  searchTerm: string
  statusFilter: "all" | "available" | "borrowed"
  onSearch: (term: string) => void
  onStatusFilter: (status: "all" | "available" | "borrowed") => void
  totalResults?: number
  isLoading?: boolean
}

export function BookSearchFilter({
  searchTerm,
  statusFilter,
  onSearch,
  onStatusFilter,
  totalResults = 0,
  isLoading = false,
}: BookSearchFilterProps) {
  const [localSearchTerm, setLocalSearchTerm] = React.useState(searchTerm)

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(localSearchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [localSearchTerm, onSearch])

  const clearFilters = () => {
    setLocalSearchTerm("")
    onStatusFilter("all")
  }

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconSearch className="size-5" />
          البحث والتصفية
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="البحث في العنوان أو المؤلف..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <IconFilter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={onStatusFilter} disabled={isLoading}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الكتب</SelectItem>
                  <SelectItem value="available">متاحة</SelectItem>
                  <SelectItem value="borrowed">مستعارة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="shrink-0"
                disabled={isLoading}
              >
                <IconX className="size-4 mr-2" />
                مسح الفلاتر
              </Button>
            )}
          </div>

          {/* Results Count */}
          {!isLoading && (
            <div className="text-sm text-muted-foreground">
              {totalResults > 0 ? (
                <>عرض {totalResults} نتيجة</>
              ) : (
                <>لا توجد نتائج</>
              )}
              {searchTerm && <> for &ldquo;{searchTerm}&rdquo;</>}
              {statusFilter !== "all" && (
                <> in {statusFilter === "available" ? "available" : "borrowed"} books</>
              )}
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                البحث: {searchTerm}
                <button
                  onClick={() => setLocalSearchTerm("")}
                  className="ml-1 hover:text-destructive"
                >
                  <IconX className="size-3" />
                </button>
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Status: {statusFilter === "available" ? "Available" : "Borrowed"}
                <button
                  onClick={() => onStatusFilter("all")}
                  className="ml-1 hover:text-destructive"
                >
                  <IconX className="size-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
