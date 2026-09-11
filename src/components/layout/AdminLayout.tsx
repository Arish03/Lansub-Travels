"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Bus,
  LayoutDashboard,
  Map,
  Route,
  Ticket,
  Users,
  Wrench,
  Fuel,
  BarChart3,
  Bell,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCircle,
  Shield,
  Briefcase,
  DollarSign,
  Bot,
  AlertTriangle,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  roles?: string[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ALL"] },
  { label: "Command Centre", href: "/command-centre", icon: Map, badge: "LIVE", badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200", roles: ["SUPER_ADMIN", "COMPANY_OWNER", "OPERATIONS_MANAGER"] },
  { label: "Trips", href: "/trips", icon: Route, roles: ["ALL"] },
  { label: "Fleet", href: "/fleet", icon: Bus, roles: ["ALL"] },
  { label: "Bookings", href: "/bookings", icon: Ticket, roles: ["SUPER_ADMIN", "COMPANY_OWNER", "OPERATIONS_MANAGER", "BOOKING_MANAGER"] },
  { label: "Routes", href: "/routes", icon: Route, roles: ["ALL"] },
  { label: "Drivers", href: "/drivers", icon: UserCircle, roles: ["SUPER_ADMIN", "COMPANY_OWNER", "OPERATIONS_MANAGER", "FLEET_MANAGER", "HR_MANAGER"] },
  { label: "Maintenance", href: "/maintenance", icon: Wrench, roles: ["SUPER_ADMIN", "COMPANY_OWNER", "FLEET_MANAGER"] },
  { label: "Fuel", href: "/fuel", icon: Fuel, roles: ["SUPER_ADMIN", "COMPANY_OWNER", "FLEET_MANAGER"] },
  { label: "HR & Crew", href: "/hr", icon: Briefcase, roles: ["SUPER_ADMIN", "COMPANY_OWNER", "HR_MANAGER"] },
  { label: "Customers", href: "/customers", icon: Users, roles: ["SUPER_ADMIN", "COMPANY_OWNER", "BOOKING_MANAGER"] },
  { label: "Analytics", href: "/analytics", icon: BarChart3, roles: ["SUPER_ADMIN", "COMPANY_OWNER", "FINANCE_MANAGER"] },
  { label: "Finance", href: "/finance", icon: DollarSign, roles: ["SUPER_ADMIN", "COMPANY_OWNER", "FINANCE_MANAGER"] },
  { label: "AI Copilot", href: "/ai-copilot", icon: Bot, badge: "AI", badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200", roles: ["SUPER_ADMIN", "COMPANY_OWNER", "OPERATIONS_MANAGER", "FINANCE_MANAGER"] },
  { label: "Alerts", href: "/alerts", icon: AlertTriangle, roles: ["ALL"] },
  { label: "Complaints", href: "/complaints", icon: MessageSquare, roles: ["ALL"] },
  { label: "Settings", href: "/settings", icon: Settings, roles: ["SUPER_ADMIN", "COMPANY_OWNER"] },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
  onClose?: () => void;
}

function Sidebar({ collapsed, onToggle, mobile = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role || "COMPANY_OWNER";

  const filteredItems = NAV_ITEMS.filter((item) => {
    if (!item.roles || item.roles.includes("ALL")) return true;
    return item.roles.includes(role);
  });

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r border-slate-200 transition-all duration-300 select-none shadow-sm",
        collapsed && !mobile ? "w-[72px]" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 border-b border-slate-200 h-16 flex-shrink-0 bg-slate-50/50">
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/30">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-slate-900 font-extrabold text-sm tracking-tight leading-tight">
                LANSUB <span className="text-blue-600">TRAVEL OS</span>
              </div>
              <div className="text-slate-500 text-[10px] font-medium tracking-wider uppercase">
                National Travels
              </div>
            </div>
          </div>
        )}

        {collapsed && !mobile && (
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-sm shadow-blue-500/30">
            <Bus className="w-5 h-5 text-white" />
          </div>
        )}

        {mobile ? (
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors ml-auto"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Operational Status Pill */}
      {(!collapsed || mobile) && (
        <div className="px-4 py-2.5 bg-slate-50/60 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-700 text-xs font-semibold">Fleet Live</span>
            </div>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              {role.replace(/_/g, " ")}
            </span>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={mobile ? onClose : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
              title={collapsed && !mobile ? item.label : undefined}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 flex-shrink-0 transition-colors",
                  isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {(!collapsed || mobile) && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold border",
                        item.badgeColor || "bg-slate-100 text-slate-700 border-slate-200"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User / Sign Out section */}
      <div className="border-t border-slate-200 p-3 flex-shrink-0 bg-slate-50/50">
        {!collapsed || mobile ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 px-2 py-1 bg-white rounded-lg border border-slate-200/80 shadow-xs">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0">
                {session?.user?.name?.charAt(0) || "N"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-slate-900 text-xs font-semibold truncate">
                  {session?.user?.name || "National Travels Admin"}
                </div>
                <div className="text-slate-500 text-[11px] truncate">
                  {session?.user?.email || "ops@nationaltravels.demo"}
                </div>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center justify-center gap-2 w-full px-3 py-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs font-medium border border-transparent hover:border-red-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center justify-center w-full p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const pageName =
    NAV_ITEMS.find((item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)))
      ?.label || "Dashboard";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 shadow-xs z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-slate-900 font-bold text-lg leading-tight">{pageName}</h1>
          <p className="text-slate-500 text-xs hidden sm:block">
            National Travels • South India Fleet Operations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Live GPS badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-700 text-xs font-semibold">GPS Active</span>
        </div>

        {/* Demo Tag */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-blue-700 text-xs font-medium">Pilot Demo</span>
        </div>

        {/* AI Quick Button */}
        <Link
          href="/ai-copilot"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask AI Copilot</span>
        </Link>

        {/* Alerts Bell */}
        <Link
          href="/alerts"
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          title="Operational Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
        </Link>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 bg-blue-100 border border-blue-300 text-blue-700 font-bold rounded-full flex items-center justify-center text-xs">
            {session?.user?.name?.charAt(0) || "A"}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-800 leading-none">
              {session?.user?.name || "Admin"}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">National Travels</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 flex-shrink-0 shadow-2xl">
            <Sidebar
              collapsed={false}
              onToggle={() => {}}
              mobile
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Main content container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
