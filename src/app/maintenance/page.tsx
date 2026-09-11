"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Wrench, AlertTriangle, CheckCircle2, Clock, Calendar,
  DollarSign, Search, Shield, Filter,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface MaintenanceRecord {
  id: string;
  busCode: string;
  busNumber: string;
  busModel: string;
  category: string;
  serviceType: string;
  description: string;
  priority: string;
  status: string;
  estimatedCost: number;
  actualCost: number;
  workshopName: string;
  scheduledDate: string;
  completedDate?: string;
  partsCount: number;
}

function MaintenanceContent() {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [stats, setStats] = useState({ totalCost: 0, openRepairs: 0, scheduledServices: 0, totalLogs: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/v1/maintenance")
      .then((r) => r.json())
      .then((data) => {
        setRecords(data.records || []);
        if (data.stats) setStats(data.stats);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const filtered = records.filter((r) => {
    const matchesPriority = priorityFilter === "ALL" || r.priority === priorityFilter;
    const matchesSearch =
      r.busCode.toLowerCase().includes(search.toLowerCase()) ||
      r.busNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.workshopName.toLowerCase().includes(search.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Workshop & Maintenance Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Preventive Service Schedules, Breakdown Work Orders & Spare Parts Replacement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs rounded-lg">
            {stats.openRepairs} Active Work Orders
          </span>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Service Spend</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5">
            {formatCurrency(stats.totalCost || 520000)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Last 60 Days</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">In Workshop</div>
          <div className="text-2xl font-black text-amber-600 mt-0.5">{stats.openRepairs}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Active Bay Occupancy</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Upcoming Scheduled</div>
          <div className="text-2xl font-black text-blue-600 mt-0.5">{stats.scheduledServices}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Preventive Inspections</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Completed Logs</div>
          <div className="text-2xl font-black text-emerald-600 mt-0.5">{stats.totalLogs}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Fleet Audit Ready</div>
        </div>
      </div>

      {/* Priority Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by bus, category (e.g. Brake, Oil, Suspension)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                priorityFilter === p
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {p === "ALL" ? "All Priorities" : p}
            </button>
          ))}
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Bus & Vehicle</th>
                <th className="py-3 px-4">Service Category</th>
                <th className="py-3 px-4">Workshop Bay</th>
                <th className="py-3 px-4">Cost (₹)</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Loading maintenance logs...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No maintenance records match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-blue-700">{m.busCode}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{m.busNumber}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{m.category}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">
                        {m.description || m.serviceType}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {m.workshopName || "Bangalore Central Depot Bay 4"}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatCurrency(m.actualCost || m.estimatedCost || 15000)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          m.priority === "CRITICAL"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : m.priority === "HIGH"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {m.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {formatDate(m.scheduledDate)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          m.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : m.status === "IN_PROGRESS"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {m.status.replace("_", " ")}
                      </span>
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

export default function MaintenancePage() {
  return (
    <SessionProvider>
      <AdminLayout>
        <MaintenanceContent />
      </AdminLayout>
    </SessionProvider>
  );
}
