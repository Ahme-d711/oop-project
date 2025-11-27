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

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Books</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {libraryStats.totalBooks}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconBook />
              Library Collection
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Available: {libraryStats.availableBooks} <IconBook className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {availabilityRate}% availability rate
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Borrowed Books</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {libraryStats.borrowedBooks}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconBookmark />
              Currently Out
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {borrowRate}% of collection <IconBookmark className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Books currently borrowed
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Members</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {libraryStats.totalMembers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUsers />
              Active Members
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Students: {libraryStats.studentMembers} <IconUsers className="size-4" />
          </div>
          <div className="text-muted-foreground">Teachers: {libraryStats.teacherMembers}</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Library Usage</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {borrowRate}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUserCheck />
              Utilization
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Books in circulation <IconUserCheck className="size-4" />
          </div>
          <div className="text-muted-foreground">Collection utilization rate</div>
        </CardFooter>
      </Card>
    </div>
  )
}
