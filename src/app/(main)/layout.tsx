
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  BarChart,
  Briefcase,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  Users,
  FileText,
  Clock,
  Plane,
  Archive,
  Home,
  LifeBuoy,
  HeartPulse,
  Hourglass,
  Award,
  BookUser,
  Calendar,
  Wallet,
  Gift,
  MessageSquare,
  Layers,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/leave", icon: CalendarCheck, label: "Leave" },
  { href: "/hiring", icon: Briefcase, label: "Hiring" },
  { href: "/employees", icon: Users, label: "Employees" },
  { href: "/referrals", icon: Gift, label: "Referrals" },
  { href: "/feedback", icon: MessageSquare, label: "Feedback" },
  { href: "/attendance", icon: Clock, label: "Attendance" },
  { href: "/timesheets", icon: Hourglass, label: "Timesheets" },
  { href: "/remote-work", icon: Home, label: "Remote Work" },
  { href: "/travel", icon: Plane, label: "Travel & Expense" },
  { href: "/assets", icon: Archive, label: "Assets" },
  { href: "/alumni", icon: BookUser, label: "Alumni" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/helpdesk", icon: LifeBuoy, label: "Helpdesk" },
  { href: "/loans", icon: Wallet, label: "Loans" },
  { href: "/performance", icon: BarChart, label: "Performance" },
  { href: "/rewards", icon: Award, label: "Rewards" },
  { href: "/skills", icon: Sparkles, label: "Skills AI" },
  { href: "/health", icon: HeartPulse, label: "Health" },
];

function Logo() {
  const { toggleSidebar, state } = useSidebar();
  return (
    <div className="flex items-center gap-2" role="button" onClick={toggleSidebar}>
      <Layers className="w-8 h-8 text-sidebar-primary" />
      <h1 className={cn("text-xl font-bold font-headline text-sidebar-foreground", state === "collapsed" && "hidden")}>Synergy HR</h1>
    </div>
  )
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-full">
            <SidebarMenu className="p-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} className="w-full">
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.href)}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <SidebarMenu>
             <SidebarMenuItem>
                <Link href="/settings" className="w-full">
                  <SidebarMenuButton
                    isActive={pathname === '/settings'}
                    tooltip="Settings"
                  >
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between px-6 h-14 border-b">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <div></div>
          <div className="flex items-center gap-4 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative w-8 h-8 rounded-full">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src="https://source.unsplash.com/random/100x100/?person" data-ai-hint="person" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-background/60">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
