"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Fuel, TrendingUp, AlertTriangle, CheckCircle2,
  Gauge, DollarSign, Calendar, Search,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const SAMPLE_FUEL_LOGS = [
  { busCode: "NT-VOLVO-01", busPlate: "KA-01-F-1001", liters: 240, cost: 21600, odometer: 142500, mileage: 4.6, station: "IOCL Hosur Road Depot", date: "Today, 06:30 AM", status: "NORMAL" },
  { busCode: "NT-SCANIA-04", busPlate: "KA-01-F-1004", liters: 280, cost: 25200, odometer: 189200, mileage: 4.2, station: "HPCL Electronic City", date: "Today, 07:15 AM", status: "NORMAL" },
  { busCode: "NT-MERC-08", busPlate: "KA-01-F-1008", liters: 310, cost: 27900, odometer: 94100, mileage: 3.1, station: "BPCL Salem Bypass", date: "Yesterday, 11:45 PM", status: "ANOMALY" },
  { busCode: "NT-VOLVO-12", busPlate: "KA-01-F-1012", liters: 235, cost: 21150, odometer: 210400, mileage: 4.8, station: "IOCL Madurai Ring Road", date: "Yesterday, 09:20 PM", status: "NORMAL" },
  { busCode: "NT-VOLVO-15", busPlate: "KA-01-F-1015", liters: 250, cost: 22500, odometer: 115600, mileage: 4.5, station: "BPCL Chennai Koyambedu", date: "Yesterday, 08:10 PM", status: "NORMAL" },
  { busCode: "NT-BB-19", busPlate: "KA-01-F-1019", liters: 290, cost: 26100, odometer: 168300, mileage: 3.4, station: "HPCL Hyderabad ORR", date: "Yesterday, 05:40 PM", status: "ANOMALY" },
];

function FuelContent() {
  const [search, setSearch] = useState("");

  const filtered = SAMPLE_FUEL_LOGS.filter(
    (l) =>
      l.busCode.toLowerCase().includes(search.toLowerCase()) ||
      l.busPlate.toLowerCase().includes(search.toLowerCase()) ||
      l.station.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Diesel & Fuel Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fleet Mileage (km/L), Fuel Thefts & Anomaly Detection, IOCL/HPCL Depot Integrations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs rounded-lg">
            Fleet Avg: 4.42 km/L
          </span>
        </div>
      </div>

      {/* Fuel KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">30D Diesel Expense</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5">₹42,80,000</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">↓ 2.4% vs last month</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average Mileage</div>
          <div className="text-2xl font-black text-blue-600 mt-0.5">4.42 km/L</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Volvo 9600 & Scania Fleet</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fuel Thefts / Drops</div>
          <div className="text-2xl font-black text-rose-600 mt-0.5">2 Flags</div>
          <div className="text-[11px] text-rose-500 font-semibold mt-0.5">Requires audit review</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Depot Pump Rate</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5">₹90.20 / L</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Bulk commercial contract</div>
        </div>
      </div>

      {/* Anomaly Callout Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-amber-900 block text-sm">
            AI Mileage Anomaly Detected on Bus NT-MERC-08 & NT-BB-19
          </span>
          <p className="text-amber-800 mt-0.5 leading-relaxed">
            Bus NT-MERC-08 returned 3.1 km/L on Bangalore-Salem run (vs expected 4.5 km/L). Possible fuel sensor calibration issue or unauthorized idling. Flagged for depot supervisor inspection.
          </p>
        </div>
      </div>

      {/* Search & Logs */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Fueling Transactions</h3>
            <p className="text-xs text-slate-500">IoT sensor verified fuel dispense readings</p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by bus or station..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Bus & Vehicle</th>
                <th className="py-3 px-4">Fuel Quantity</th>
                <th className="py-3 px-4">Total Amount (₹)</th>
                <th className="py-3 px-4">Odometer</th>
                <th className="py-3 px-4">Calculated Mileage</th>
                <th className="py-3 px-4">Fuel Station Depot</th>
                <th className="py-3 px-4">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((l, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-extrabold text-blue-700">{l.busCode}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{l.busPlate}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{l.liters} Liters</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{formatCurrency(l.cost)}</td>
                  <td className="py-3 px-4 text-slate-700">{l.odometer.toLocaleString("en-IN")} km</td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-black ${
                        l.mileage < 3.5 ? "text-rose-600" : "text-emerald-700"
                      }`}
                    >
                      {l.mileage} km/L
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{l.station}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        l.status === "NORMAL"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {l.status}
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

export default function FuelPage() {
  return (
    <SessionProvider>
      <AdminLayout>
        <FuelContent />
      </AdminLayout>
    </SessionProvider>
  );
}
