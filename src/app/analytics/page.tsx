"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  BarChart3, TrendingUp, DollarSign, Activity,
  ArrowUpRight, ArrowDownRight, Calendar, ExternalLink,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { formatCurrency, formatPercent } from "@/lib/utils";

const ROUTE_PROFIT_DATA = [
  { route: "BLR ↔ MAA", revenue: 840000, cost: 480000, profit: 360000, margin: 42.8 },
  { route: "BLR ↔ HYD", revenue: 920000, cost: 560000, profit: 360000, margin: 39.1 },
  { route: "BLR ↔ GOA", revenue: 680000, cost: 410000, profit: 270000, margin: 39.7 },
  { route: "BLR ↔ CJB", revenue: 520000, cost: 310000, profit: 210000, margin: 40.3 },
  { route: "HYD ↔ VJA", revenue: 460000, cost: 280000, profit: 180000, margin: 39.1 },
  { route: "MAA ↔ MDU", revenue: 490000, cost: 310000, profit: 180000, margin: 36.7 },
];

const OCCUPANCY_BY_DAY = [
  { day: "Mon", occupancy: 72 },
  { day: "Tue", occupancy: 68 },
  { day: "Wed", occupancy: 71 },
  { day: "Thu", occupancy: 79 },
  { day: "Fri", occupancy: 94 },
  { day: "Sat", occupancy: 91 },
  { day: "Sun", occupancy: 96 },
];

function AnalyticsContent() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Revenue Analytics & Trip Profit Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cost-per-Kilometer, Route Net Margins & Weekend Dynamic Yield Intelligence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs rounded-lg">
            30-Day Aggregated Data
          </span>
        </div>
      </div>

      {/* Analytics KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gross Fleet Collections</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5">₹1.48 Cr</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">↑ 8.2% vs previous 30d</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Net Operating Profit</div>
          <div className="text-2xl font-black text-emerald-600 mt-0.5">₹48.2 Lakhs</div>
          <div className="text-[11px] text-slate-400 mt-0.5">32.5% Net Margin</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Weekend Occupancy</div>
          <div className="text-2xl font-black text-blue-600 mt-0.5">93.7%</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-0.5">Friday - Sunday peaks</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Direct Channel Share</div>
          <div className="text-2xl font-black text-purple-600 mt-0.5">58.4%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Saves ₹6.2L in OTA fees</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Route Profitability Chart */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Route Revenue vs Operational Costs</h3>
              <p className="text-xs text-slate-500">Gross ticket intake compared to diesel, crew and tolls</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ROUTE_PROFIT_DATA} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="route" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                  }}
                  formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="revenue" name="Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cost" name="Operating Cost" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Day of Week Occupancy Curve */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Occupancy by Day of Week</h3>
              <p className="text-xs text-slate-500">Peak demand surges on weekends across South India routes</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={OCCUPANCY_BY_DAY} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                  }}
                  formatter={(v: any) => [`${v}%`, "Occupancy Rate"]}
                />
                <Bar dataKey="occupancy" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Route Profitability Ranking Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80">
          <h3 className="text-sm font-bold text-slate-900">Route Profit Margin Leaderboard</h3>
          <p className="text-xs text-slate-500">Ranked by net operating profitability</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Route Name</th>
                <th className="py-3 px-4">Gross Revenue</th>
                <th className="py-3 px-4">Operating Cost</th>
                <th className="py-3 px-4">Net Profit</th>
                <th className="py-3 px-4">Margin (%)</th>
                <th className="py-3 px-4">Yield Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {ROUTE_PROFIT_DATA.map((r) => (
                <tr key={r.route} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-blue-700">{r.route}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{formatCurrency(r.revenue)}</td>
                  <td className="py-3.5 px-4 text-slate-600">{formatCurrency(r.cost)}</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-700">{formatCurrency(r.profit)}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-slate-900">{r.margin}%</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ★ High Yield
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <SessionProvider>
      <AdminLayout>
        <AnalyticsContent />
      </AdminLayout>
    </SessionProvider>
  );
}
