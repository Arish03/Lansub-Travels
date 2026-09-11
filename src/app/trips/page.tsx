"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Route as RouteIcon, Bus, Clock, Calendar, Search, Filter,
  ArrowRight, Users, DollarSign, CheckCircle2, AlertCircle,
  ExternalLink,
} from "lucide-react";
import { formatCurrency, formatTime, formatDate } from "@/lib/utils";
import Link from "next/link";

interface Trip {
  id: string;
  tripCode: string;
  route: string;
  origin: string;
  destination: string;
  busCode: string;
  busNumber: string;
  busModel: string;
  totalSeats: number;
  bookedSeats: number;
  occupancyPct: number;
  departure: string;
  arrival: string;
  status: string;
  delayMinutes: number;
  driverName: string;
  fare: number;
  revenue: number;
}

function TripStatusPill({ status, delay }: { status: string; delay: number }) {
  if (delay > 10) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600" />
        Delayed {delay}m
      </span>
    );
  }

  const badges: Record<string, string> = {
    COMPLETED: "bg-slate-100 text-slate-700 border-slate-200",
    ARRIVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    IN_TRANSIT: "bg-blue-50 text-blue-700 border-blue-200",
    DEPARTED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    BOARDING: "bg-purple-50 text-purple-700 border-purple-200",
    SCHEDULED: "bg-slate-100 text-slate-600 border-slate-200",
    CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badges[status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function TripsContent() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/v1/trips")
      .then((r) => r.json())
      .then((data) => {
        setTrips(data.trips || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const filtered = trips.filter((t) => {
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchesSearch =
      t.tripCode.toLowerCase().includes(search.toLowerCase()) ||
      t.route.toLowerCase().includes(search.toLowerCase()) ||
      t.busCode.toLowerCase().includes(search.toLowerCase()) ||
      t.driverName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeCount = trips.filter((t) => ["IN_TRANSIT", "DEPARTED", "BOARDING"].includes(t.status)).length;
  const completedCount = trips.filter((t) => ["COMPLETED", "ARRIVED"].includes(t.status)).length;
  const scheduledCount = trips.filter((t) => t.status === "SCHEDULED").length;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Trip Operations & Dispatch</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Intercity schedules, real-time occupancy, crew assignments, and ticket collection
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/command-centre"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            Live GPS Tracking
          </Link>
        </div>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === "ALL"
              ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-400/20 shadow-xs"
              : "bg-white border-slate-200/90 hover:bg-slate-50"
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Trips</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5">{trips.length}</div>
        </button>

        <button
          onClick={() => setStatusFilter("IN_TRANSIT")}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === "IN_TRANSIT"
              ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-400/20 shadow-xs"
              : "bg-white border-slate-200/90 hover:bg-slate-50"
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active & Enroute</div>
          <div className="text-2xl font-black text-blue-600 mt-0.5">{activeCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter("SCHEDULED")}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === "SCHEDULED"
              ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-400/20 shadow-xs"
              : "bg-white border-slate-200/90 hover:bg-slate-50"
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Upcoming Scheduled</div>
          <div className="text-2xl font-black text-slate-700 mt-0.5">{scheduledCount}</div>
        </button>

        <button
          onClick={() => setStatusFilter("COMPLETED")}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === "COMPLETED"
              ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-400/20 shadow-xs"
              : "bg-white border-slate-200/90 hover:bg-slate-50"
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Completed Trips</div>
          <div className="text-2xl font-black text-emerald-600 mt-0.5">{completedCount}</div>
        </button>
      </div>

      {/* Search & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by trip code, city, vehicle, or driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {filtered.length} of {trips.length} trips
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Trip Code</th>
                <th className="py-3 px-4">Route & Schedule</th>
                <th className="py-3 px-4">Bus & Vehicle</th>
                <th className="py-3 px-4">Assigned Pilot</th>
                <th className="py-3 px-4">Occupancy</th>
                <th className="py-3 px-4">Est. Collections</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Loading trips...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No trips match the selected criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-blue-700">{t.tripCode}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {formatDate(t.departure)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{t.origin}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span>{t.destination}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Dept: {formatTime(t.departure)} • Arr: {formatTime(t.arrival)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{t.busCode}</div>
                      <div className="text-[11px] text-slate-400">{t.busNumber}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{t.driverName}</div>
                      <div className="text-[10px] text-slate-400">Lead Driver</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${Math.min(100, t.occupancyPct)}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800">{t.occupancyPct}%</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {t.bookedSeats} / {t.totalSeats} seats
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatCurrency(t.revenue)}
                    </td>

                    <td className="py-3.5 px-4">
                      <TripStatusPill status={t.status} delay={t.delayMinutes} />
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

export default function TripsPage() {
  return (
    <SessionProvider>
      <AdminLayout>
        <TripsContent />
      </AdminLayout>
    </SessionProvider>
  );
}
