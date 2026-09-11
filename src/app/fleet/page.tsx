"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Bus, Search, Filter, Plus, AlertTriangle, CheckCircle,
  Wrench, Fuel, FileText, MapPin, Activity, TrendingDown,
  ChevronRight, MoreVertical, Battery, Thermometer, Gauge,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface Vehicle {
  id: string;
  vehicleCode: string;
  vehicleNumber: string;
  model: string;
  manufacturer: string;
  year: number;
  status: string;
  seatingCapacity: number;
  odometer: number;
  fuelLevel: number;
  engineTemp: number;
  batteryVoltage: number;
  speed: number;
  latitude: number;
  longitude: number;
  lastGpsUpdate: string;
  _count: { trips: number; maintenance: number; alerts: number };
  nextMaintenance?: { category: string; nextDueDate: string; priority: string };
  docsExpiringSoon?: number;
}

function VehicleCard({ v }: { v: Vehicle }) {
  const fuelLow = v.fuelLevel < 25;
  const tempHigh = v.engineTemp > 105;
  const battLow = v.batteryVoltage < 12;
  const hasIssue = fuelLow || tempHigh || battLow || v.status === "BREAKDOWN";

  const statusStyles: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    IN_TRANSIT: "bg-blue-50 text-blue-700 border-blue-200",
    MAINTENANCE: "bg-amber-50 text-amber-700 border-amber-200",
    BREAKDOWN: "bg-rose-50 text-rose-700 border-rose-200",
    IDLE: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <div
      className={`bg-white border rounded-xl p-4 transition-all shadow-xs hover:shadow-md ${
        hasIssue ? "border-amber-300 ring-1 ring-amber-200/50" : "border-slate-200/90"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2.5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-900 font-extrabold text-sm">{v.vehicleCode}</span>
            {hasIssue && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
          </div>
          <div className="text-slate-500 text-xs font-mono">{v.vehicleNumber}</div>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            statusStyles[v.status] || statusStyles.IDLE
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              v.status === "ACTIVE"
                ? "bg-emerald-500 animate-pulse"
                : v.status === "BREAKDOWN"
                ? "bg-rose-500"
                : "bg-slate-400"
            }`}
          />
          {v.status.replace("_", " ")}
        </span>
      </div>

      {/* Model & Manufacturer */}
      <div className="text-slate-700 text-xs font-semibold mb-3">
        {v.model} <span className="text-slate-400 font-normal">({v.year})</span>
      </div>

      {/* IoT Sensors row */}
      <div className="grid grid-cols-3 gap-1.5 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 mb-0.5">
            <Fuel className={`w-3 h-3 ${fuelLow ? "text-rose-500" : "text-slate-400"}`} />
            <span>Fuel</span>
          </div>
          <div className={`text-xs font-bold ${fuelLow ? "text-rose-600" : "text-slate-800"}`}>
            {v.fuelLevel?.toFixed(0)}%
          </div>
        </div>

        <div className="text-center border-x border-slate-200">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 mb-0.5">
            <Thermometer className={`w-3 h-3 ${tempHigh ? "text-amber-500" : "text-slate-400"}`} />
            <span>Engine</span>
          </div>
          <div className={`text-xs font-bold ${tempHigh ? "text-amber-600" : "text-slate-800"}`}>
            {v.engineTemp?.toFixed(0)}°C
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 mb-0.5">
            <Battery className={`w-3 h-3 ${battLow ? "text-rose-500" : "text-slate-400"}`} />
            <span>Battery</span>
          </div>
          <div className={`text-xs font-bold ${battLow ? "text-rose-600" : "text-slate-800"}`}>
            {v.batteryVoltage?.toFixed(1)}V
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
        <span>{(v.odometer || 0).toLocaleString("en-IN")} km</span>
        <span>{v.seatingCapacity} seats</span>
        <span>{v._count.trips} trips</span>
      </div>

      {/* Maintenance alert badge if any */}
      {v.nextMaintenance?.nextDueDate && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-slate-600 font-medium">
            <Wrench className="w-3 h-3 text-amber-500" />
            {v.nextMaintenance.category}
          </span>
          <span className="text-amber-700 font-bold">Due Soon</span>
        </div>
      )}

      {/* Action link */}
      <div className="mt-3 pt-2 flex items-center justify-between text-xs font-semibold">
        <Link
          href={`/command-centre`}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-[11px]"
        >
          Track on Map <ExternalLink className="w-3 h-3" />
        </Link>
        <span className="text-[11px] text-slate-400">
          GPS: {v.speed ? `${Math.round(v.speed)} km/h` : "Stationary"}
        </span>
      </div>
    </div>
  );
}

function FleetContent() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/v1/vehicles")
      .then((r) => r.json())
      .then((data) => {
        setVehicles(data.vehicles || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const counts = {
    ALL: vehicles.length,
    ACTIVE: vehicles.filter((v) => v.status === "ACTIVE" || v.status === "IN_TRANSIT").length,
    MAINTENANCE: vehicles.filter((v) => v.status === "MAINTENANCE").length,
    BREAKDOWN: vehicles.filter((v) => v.status === "BREAKDOWN").length,
    IDLE: vehicles.filter((v) => v.status === "IDLE").length,
  };

  const filtered = vehicles.filter((v) => {
    const matchesFilter =
      filter === "ALL" ||
      (filter === "ACTIVE" && (v.status === "ACTIVE" || v.status === "IN_TRANSIT")) ||
      v.status === filter;

    const matchesSearch =
      v.vehicleCode.toLowerCase().includes(search.toLowerCase()) ||
      v.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Bar with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Fleet Master</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            50 Premium Multi-Axle Volvo, Scania & Mercedes Buses • National Travels
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/command-centre"
            className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
          >
            Live GPS Tracking
          </Link>
          <Link
            href="/maintenance"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
          >
            Workshop & Services
          </Link>
        </div>
      </div>

      {/* Status Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { key: "ALL", label: "Total Fleet", count: counts.ALL, color: "border-slate-300 text-slate-900" },
          { key: "ACTIVE", label: "Active & Enroute", count: counts.ACTIVE, color: "border-emerald-300 text-emerald-700" },
          { key: "MAINTENANCE", label: "In Workshop", count: counts.MAINTENANCE, color: "border-amber-300 text-amber-700" },
          { key: "BREAKDOWN", label: "Breakdown", count: counts.BREAKDOWN, color: "border-rose-300 text-rose-700" },
          { key: "IDLE", label: "Standby / Depo", count: counts.IDLE, color: "border-slate-300 text-slate-600" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              filter === item.key
                ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-400/20 shadow-xs"
                : "bg-white border-slate-200/90 hover:bg-slate-50"
            }`}
          >
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</div>
            <div className={`text-2xl font-black mt-0.5 ${item.color}`}>{item.count}</div>
          </button>
        ))}
      </div>

      {/* Search & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code (e.g. NT-VOLVO-01), plate, or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {filtered.length} of {vehicles.length} buses
        </div>
      </div>

      {/* Vehicles Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-600 text-sm font-semibold">Loading National Travels Fleet...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl p-8">
          <Bus className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No vehicles match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try changing your search term or status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((v) => (
            <VehicleCard key={v.id} v={v} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FleetPage() {
  return (
    <SessionProvider>
      <AdminLayout>
        <FleetContent />
      </AdminLayout>
    </SessionProvider>
  );
}
