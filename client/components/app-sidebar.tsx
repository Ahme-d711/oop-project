"use client"

import * as React from "react"
import { motion } from "motion/react"
import {
  IconBook,
  IconBookmark,
  IconDashboard,
  IconInnerShadowTop,
  IconSearch,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "أمين المكتبة",
    email: "librarian@library.com",
    avatar: "/avatars/librarian.jpg",
  },
  navMain: [
    {
      title: "لوحة التحكم",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "الكتب",
      url: "/books",
      icon: IconBook,
    },
    {
      title: "الأعضاء",
      url: "/members",
      icon: IconUsers,
    },
    {
      title: "الاستعارة",
      url: "/borrowing",
      icon: IconBookmark,
    },
  ],
  navSecondary: [
    {
      title: "بحث",
      url: "/books",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Sidebar side="right" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">نظام المكتبة</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
    </motion.div>
  )
}
