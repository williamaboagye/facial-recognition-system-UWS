import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarInset, SidebarGroup, SidebarGroupContent, SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/core/contexts/AuthContext"

interface NavItem {
  label: string
  path: string
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",           path: "/dashboard" },
  { label: "Take Attendance",     path: "/take-attendance" },
  { label: "Attendance Records",  path: "/attendance-records" },
  { label: "Analytics & Reports", path: "/analytics" },
  // { label: "At-Risk Students",    path: "/at-risk-students" },
  { label: "Student Management",  path: "/student-management" },
  { label: "Module Management",   path: "/module-management" },
]

interface AppLayoutProps {
  children: React.ReactNode
  onLogout: () => Promise<void>
}

export default function AppLayout({ children, onLogout }: AppLayoutProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  // const unread = notifications.filter((n) => !n.read).length

  const pageTitle = [...NAV_ITEMS, { label: "Settings", path: "/settings" }]
    .find((n) => n.path === location.pathname)?.label ?? "UWS Attendance System"

     const initials = user?.name
    ? user.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : "?"

  return (
    <SidebarProvider>
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <Sidebar>
        {/* Brand */}
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-xs font-light text-primary-foreground">UWS</span>
            </div>
            <span className="text-sm font-semibold text-foreground">UWS Attendance System</span>
          </div>
        </SidebarHeader>

        {/* Navigation */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map(({ label, path }) => (
                  <SidebarMenuItem key={path}>
                    <NavLink to={path} className="block w-full">
                      {({ isActive }) => (
                        <SidebarMenuButton isActive={isActive}>
                          {label}
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer — Settings + Logout + Profile */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <NavLink to="/settings" className="block w-full">
                {({ isActive }) => (
                  <SidebarMenuButton isActive={isActive}>Settings</SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => onLogout().catch(() => {})}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                Log out
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <Separator className="my-2" />
          <div className="flex items-center gap-3 px-3 py-1">
            <Avatar className="h-8 w-8 border border-sidebar-border">
              <AvatarFallback className="text-[11px] font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* ── Main area ──────────────────────────────────────────── */}
      <SidebarInset>
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
          <h1 className="text-base font-semibold">Hi {user?.name ?? "there"} 👋</h1>
          </div>

          {/* Notification bell */}
          {/* <div className="relative"> */}
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotifOpen((o) => !o)}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]">
                  {unread}
                </Badge>
              )}
            </Button> */}

            {/* Notification dropdown */}
            {/* {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg border bg-background shadow-lg z-50 overflow-hidden">
                <div className="border-b px-4 py-3">
                  <p className="text-sm font-semibold">Notifications</p>
                </div>
                <ul className="max-h-72 divide-y overflow-y-auto">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className={`px-4 py-3 text-sm ${!n.read ? "bg-accent/30" : ""}`}
                    >
                      <p className={!n.read ? "font-medium text-foreground" : "text-muted-foreground"}>
                        {n.message}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )} */}
          {/* </div> */}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 ">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
