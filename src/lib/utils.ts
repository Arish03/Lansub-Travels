import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`;
  return `${Math.floor(diffMin / 1440)}d ago`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    ACTIVE: "status-active",
    ON_TRIP: "status-active",
    COMPLETED: "status-completed",
    DEPARTED: "status-active",
    IN_TRANSIT: "status-on-time",
    ARRIVED: "status-completed",
    SCHEDULED: "status-scheduled",
    BOARDING: "status-scheduled",
    IDLE: "status-idle",
    MAINTENANCE: "status-maintenance",
    BREAKDOWN: "status-breakdown",
    CANCELLED: "status-cancelled",
    DELAYED: "status-delayed",
    ON_TIME: "status-on-time",
    AVAILABLE: "status-active",
    OFF_DUTY: "status-idle",
    ON_LEAVE: "status-idle",
    BOOKED: "status-on-time",
    REFUNDED: "status-cancelled",
    OPEN: "status-scheduled",
    IN_PROGRESS: "status-on-time",
    RESOLVED: "status-completed",
    CLOSED: "status-idle",
    CRITICAL: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    WARNING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    INFO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    SUCCESS: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  };
  return map[status] || "status-idle";
}

export function getTrendIcon(value: number): string {
  if (value > 0) return "↑";
  if (value < 0) return "↓";
  return "→";
}

export function getOccupancyColor(pct: number): string {
  if (pct >= 90) return "text-red-400";
  if (pct >= 70) return "text-emerald-400";
  if (pct >= 50) return "text-amber-400";
  return "text-slate-400";
}

export function getBusStatusDot(status: string): string {
  const map: Record<string, string> = {
    ACTIVE: "bg-emerald-400",
    ON_TRIP: "bg-emerald-400",
    IN_TRANSIT: "bg-blue-400",
    IDLE: "bg-slate-400",
    MAINTENANCE: "bg-amber-400",
    BREAKDOWN: "bg-red-500",
    RETIRED: "bg-slate-600",
  };
  return map[status] || "bg-slate-400";
}

export function generateBookingRef(): string {
  return `NT${Date.now().toString(36).toUpperCase()}`;
}
