"use client"

import * as React from "react"
import {
  IconBook,
  IconBookmark,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconUserPlus,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
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
    name: "Librarian",
    email: "librarian@library.com",
    avatar: "/avatars/librarian.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Books",
      url: "/books",
      icon: IconBook,
    },
    {
      title: "Members",
      url: "/members",
      icon: IconUsers,
    },
    {
      title: "Borrowing",
      url: "/borrowing",
      icon: IconBookmark,
    },
    {
      title: "Analytics",
      url: "/dashboard",
      icon: IconChartBar,
    },
  ],
  navClouds: [
    {
      title: "Book Management",
      icon: IconBook,
      isActive: true,
      url: "/books",
      items: [
        {
          title: "All Books",
          url: "/books",
        },
        {
          title: "Add New Book",
          url: "/books",
        },
        {
          title: "Categories",
          url: "/books",
        },
      ],
    },
    {
      title: "Member Management",
      icon: IconUserPlus,
      url: "/members",
      items: [
        {
          title: "All Members",
          url: "/members",
        },
        {
          title: "Register New Member",
          url: "/members",
        },
        {
          title: "Member Types",
          url: "/members",
        },
      ],
    },
    {
      title: "Reports",
      icon: IconReport,
      url: "/borrowing",
      items: [
        {
          title: "Borrowing History",
          url: "/borrowing",
        },
        {
          title: "Overdue Books",
          url: "/borrowing",
        },
        {
          title: "Popular Books",
          url: "/dashboard",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/books",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "/dashboard",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "/borrowing",
      icon: IconReport,
    },
    {
      name: "Writing Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Library System</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
