"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  UserCircle, Star, Phone, Award, Shield, Search,
  CheckCircle2, AlertCircle, Clock,
} from "lucide-react";

interface Driver {
  id: string;
  name: string;
  employeeCode: string;
  phone: string;
  email: string;
  branch: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiry: string;
  safetyScore: number;
  experienceYears: number;
  dutyStatus: string;
  totalTrips: number;
}

function DriversContent() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dutyFilter, setDutyFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/v1/drivers")
      .then((r) => r.json())
      .then((data) => {
        setDrivers(data.drivers || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const filtered = drivers.filter((d) => {
    const matchesDuty = dutyFilter === "ALL" || d.dutyStatus === dutyFilter;
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase());
    return matchesDuty && matchesSearch;
  });

  const dutyStyles: Record<string, string> = {
    ON_DUTY: "bg-emerald-50 text-emerald-700 border-emerald-200",
    OFF_DUTY: "bg-slate-100 text-slate-700 border-slate-200",
    REST: "bg-blue-50 text-blue-700 border-blue-200",
    ON_LEAVE: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Pilots & Drivers Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            100 Certified Multi-Axle Volvo Pilots • Safety Scores, Driving Rosters & Licensing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs rounded-lg">
            {drivers.filter((d) => d.dutyStatus === "ON_DUTY").length} On Duty Today
          </span>
        </div>
      </div>

      {/* Duty Status Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["ALL", "ON_DUTY", "REST", "OFF_DUTY", "ON_LEAVE"].map((st) => (
          <button
            key={st}
            onClick={() => setDutyFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              dutyFilter === st
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {st === "ALL" ? `All Drivers (${drivers.length})` : st.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by driver name, ID, phone, or license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {filtered.length} drivers
        </div>
      </div>

      {/* Drivers Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-600 text-sm font-semibold">Loading Driver Directory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                      {d.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-slate-900 font-bold text-sm leading-tight">{d.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{d.employeeCode}</div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      dutyStyles[d.dutyStatus] || "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {d.dutyStatus.replace("_", " ")}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">License</span>
                    <span className="font-mono font-semibold text-slate-800">{d.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Experience</span>
                    <span className="font-semibold text-slate-800">{d.experienceYears} Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Base Depot</span>
                    <span className="font-semibold text-slate-800">{d.branch}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{d.safetyScore || 4.8} / 5</span>
                </div>
                <div className="text-slate-500 font-medium text-[11px]">
                  {d.totalTrips} Completed Trips
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DriversPage() {
  return (
    <SessionProvider>
      <AdminLayout>
        <DriversContent />
      </AdminLayout>
    </SessionProvider>
  );
}
