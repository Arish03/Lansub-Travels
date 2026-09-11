"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Bus,
  TrendingUp,
  Ticket,
  DollarSign,
  Users,
  AlertTriangle,
  MapPin,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  Activity,
  BarChart3,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatCurrency, formatNumber, formatPercent, formatTime } from "@/lib/utils";
import Link from "next/link";

interface DashboardData {
  fleet: { totalBuses: number; activeBuses: number; maintenanceBuses: number; breakdownBuses: number; idleBuses: number };
  trips: { todayTrips: number; completedTrips: number; cancelledTrips: number; activeTrips: number; delayedTrips: number };
  bookings: { todayBookings: number };
  revenue: {
    last30Days: number; netRevenue: number; totalCost: number; profit: number;
    fuelCost: number; maintenanceCost: number; crewCost: number; commissions: number;
    avgOccupancy: number; avgProfitMargin: number; todayRevenue: number;
  };
  alerts: number;
  complaints: number;
  customers: number;
  todayOps: Array<{
    id: string; tripCode: string; route: string; busCode: string; busNumber: string;
    driverName: string; departure: string; status: string; occupancyPct: number;
    bookedSeats: number; totalSeats: number; delayMinutes: number;
  }>;
  channelRevenue: Array<{ channel: string; bookings: number; revenue: number; commission: number }>;
  revenueTrend: Array<{ date: string; revenue: number; bookings: number }>;
  routeStats: Array<{ route: string; avgOccupancy: number; totalProfit: number; totalRevenue: number }>;
  aiInsight: {
    summary: string;
    metrics: Array<{ label: string; value: string; trend: string; color: string }>;
    recommendations: string[];
  } | null;
  recentAlerts: Array<{ id: string; type: string; severity: string; title: string; message: string; createdAt: string }>;
}

const CHANNEL_COLORS: Record<string, string> = {
  WEBSITE: "#2563eb",
  APP: "#7c3aed",
  COUNTER: "#059669",
  AGENT: "#d97706",
  REDBUS: "#dc2626",
  ABHIBUS: "#ea580c",
  PHONE: "#0891b2",
};

function KpiCard({
  label,
  value,
  sub,
  change,
  changeLabel,
  icon: Icon,
  color = "blue",
  href,
}: {
  label: string;
  value: string | number;
  sub?: string;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  href?: string;
}) {
  const iconTheme = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  }[color] || "bg-blue-50 text-blue-600 border-blue-100";

  const card = (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-start justify-between mb-2.5">
        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${iconTheme}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${
              change >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            {change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</div>
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-1 truncate">{sub}</div>}
      {changeLabel && (
        <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{changeLabel}</div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }
  return card;
}

function TripStatusBadge({ status, delay }: { status: string; delay: number }) {
  if (delay > 10) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600" />
        Delayed {delay}m
      </span>
    );
  }

  const badges: Record<string, { label: string; class: string }> = {
    COMPLETED: { label: "Completed", class: "bg-slate-100 text-slate-700 border-slate-200" },
    ARRIVED: { label: "Arrived", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    IN_TRANSIT: { label: "In Transit", class: "bg-blue-50 text-blue-700 border-blue-200" },
    DEPARTED: { label: "Departed", class: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    BOARDING: { label: "Boarding", class: "bg-purple-50 text-purple-700 border-purple-200" },
    SCHEDULED: { label: "Scheduled", class: "bg-slate-100 text-slate-600 border-slate-200" },
    CANCELLED: { label: "Cancelled", class: "bg-rose-50 text-rose-700 border-rose-200" },
  };

  const badge = badges[status] || { label: status, class: "bg-slate-100 text-slate-700 border-slate-200" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.class}`}>
      {badge.label}
    </span>
  );
}

function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-600 text-sm font-semibold">Loading National Travels Operations Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-600">
        No dashboard data available. Please verify the seed data.
      </div>
    );
  }

  const { fleet, trips, bookings, revenue, alerts, complaints, routeStats, revenueTrend, channelRevenue, aiInsight, todayOps } = data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Operations & Fleet Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time telemetry and revenue intelligence for National Travels (Bangalore HQ)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Today, {new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
          <Link
            href="/command-centre"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Live Command Centre</span>
          </Link>
        </div>
      </div>

      {/* AI Daily Operations Brief */}
      {aiInsight && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white border border-blue-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Lansub AI Daily Operations Brief
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold border border-blue-200">
              Live Analysis
            </span>
          </div>

          <p className="text-slate-800 text-sm font-medium leading-relaxed mb-4">
            {aiInsight.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-blue-100">
            {aiInsight.recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-2 bg-white/90 border border-blue-100 rounded-lg p-2.5 text-xs text-slate-700 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Performance Indicators (6 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard
          label="Total Fleet"
          value={fleet.totalBuses}
          sub={`${fleet.activeBuses} active • ${fleet.maintenanceBuses} workshop`}
          icon={Bus}
          color="blue"
          href="/fleet"
        />
        <KpiCard
          label="Today's Trips"
          value={trips.todayTrips}
          sub={`${trips.activeTrips} on route • ${trips.completedTrips} done`}
          icon={MapPin}
          color="indigo"
          href="/trips"
        />
        <KpiCard
          label="Bookings Today"
          value={bookings.todayBookings}
          sub={`${alerts} alerts • ${complaints} complaints`}
          icon={Ticket}
          color="purple"
          href="/bookings"
        />
        <KpiCard
          label="Today Revenue"
          value={formatCurrency(revenue.todayRevenue)}
          icon={DollarSign}
          color="emerald"
          href="/finance"
        />
        <KpiCard
          label="30D Net Profit"
          value={formatCurrency(revenue.profit)}
          sub={`${formatPercent(revenue.avgProfitMargin)} margin`}
          change={6.8}
          changeLabel="vs previous cycle"
          icon={TrendingUp}
          color="emerald"
          href="/finance"
        />
        <KpiCard
          label="Avg Occupancy"
          value={formatPercent(revenue.avgOccupancy)}
          sub="Fleet average"
          change={3.4}
          icon={Activity}
          color="amber"
          href="/analytics"
        />
      </div>

      {/* Operations Quick Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fleet Distribution */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Fleet Status</span>
            <Link href="/fleet" className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
              View All <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                <span>Active & In-Transit ({fleet.activeBuses})</span>
                <span className="text-emerald-700 font-bold">{Math.round((fleet.activeBuses / fleet.totalBuses) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(fleet.activeBuses / fleet.totalBuses) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                <span>Workshop / Maintenance ({fleet.maintenanceBuses})</span>
                <span className="text-amber-700 font-bold">{Math.round((fleet.maintenanceBuses / fleet.totalBuses) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(fleet.maintenanceBuses / fleet.totalBuses) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                <span>Standby / Idle ({fleet.idleBuses})</span>
                <span className="text-slate-600 font-bold">{Math.round((fleet.idleBuses / fleet.totalBuses) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: `${(fleet.idleBuses / fleet.totalBuses) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Operating Financials */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">30D Cost Structure</span>
            <Link href="/finance" className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
              Full P&L <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 block">Fuel Cost</span>
              <span className="text-sm font-bold text-slate-900">{formatCurrency(revenue.fuelCost)}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 block">Maintenance</span>
              <span className="text-sm font-bold text-slate-900">{formatCurrency(revenue.maintenanceCost)}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 block">Driver & Crew</span>
              <span className="text-sm font-bold text-slate-900">{formatCurrency(revenue.crewCost)}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 block">OTA Commissions</span>
              <span className="text-sm font-bold text-slate-900">{formatCurrency(revenue.commissions)}</span>
            </div>
          </div>
        </div>

        {/* Real-time Alert Counter */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Alerts & Incidents</span>
              <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs rounded-full">
                {alerts} Active
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Telemetry triggers for overspeeding, document expiry, geofencing, and schedule delays.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/alerts"
              className="flex-1 py-2 text-center bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors"
            >
              Review Alerts ({alerts})
            </Link>
            <Link
              href="/complaints"
              className="flex-1 py-2 text-center bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition-colors"
            >
              Complaints ({complaints})
            </Link>
          </div>
        </div>
      </div>

      {/* Charts Section: Revenue Trend & Channel Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue & Bookings Trend */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Revenue & Booking Trajectory (30 Days)</h3>
              <p className="text-xs text-slate-500">Daily gross ticket collections across all channels</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-blue-600 rounded-xs" />
                <span className="text-slate-600">Revenue (₹)</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    fontSize: "0.75rem",
                  }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 2, fill: "#2563eb" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Distribution */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Booking Channel Share</h3>
            <p className="text-xs text-slate-500 mb-2">Direct vs OTA volume distribution</p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelRevenue}
                    dataKey="bookings"
                    nameKey="channel"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    innerRadius={40}
                    paddingAngle={3}
                  >
                    {channelRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[entry.channel] || "#64748b"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e2e8f0",
                      borderRadius: "0.5rem",
                      fontSize: "0.75rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {channelRevenue.slice(0, 4).map((ch) => (
              <div key={ch.channel} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CHANNEL_COLORS[ch.channel] || "#64748b" }}
                  />
                  <span className="font-semibold text-slate-700">{ch.channel}</span>
                </div>
                <span className="text-slate-900 font-bold">{ch.bookings} bookings</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Active Operations Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Today&apos;s Live Operations</h3>
            <p className="text-xs text-slate-500">Real-time bus dispatch and occupancy status</p>
          </div>
          <Link
            href="/trips"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Manage All Trips <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Trip Code</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Bus & Vehicle</th>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Departure</th>
                <th className="py-3 px-4">Occupancy</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {todayOps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400">
                    No active trips scheduled for today.
                  </td>
                </tr>
              ) : (
                todayOps.slice(0, 8).map((trip) => (
                  <tr key={trip.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-blue-700">{trip.tripCode}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{trip.route}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{trip.busCode}</div>
                      <div className="text-[11px] text-slate-400">{trip.busNumber}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{trip.driverName}</td>
                    <td className="py-3 px-4 text-slate-600">{formatTime(trip.departure)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${Math.min(100, trip.occupancyPct)}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800">{trip.occupancyPct}%</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {trip.bookedSeats} / {trip.totalSeats} seats
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <TripStatusBadge status={trip.status} delay={trip.delayMinutes} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <SessionProvider>
      <AdminLayout>
        <DashboardContent />
      </AdminLayout>
    </SessionProvider>
  );
}
