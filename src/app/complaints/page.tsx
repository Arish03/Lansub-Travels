"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  MessageSquare, AlertCircle, CheckCircle2, Clock,
  Search, Shield, Phone, ExternalLink,
} from "lucide-react";

const SAMPLE_COMPLAINTS = [
  { id: "TKT-8801", passenger: "Kavitha R.", phone: "+91 98450 12890", trip: "Bangalore → Chennai (KA-01-F-1001)", category: "AC_MALFUNCTION", title: "Upper Berth AC vent blowing lukewarm air", status: "INVESTIGATING", sla: "2h remaining", priority: "HIGH" },
  { id: "TKT-8802", passenger: "Mohammed Irfan", phone: "+91 98450 23901", trip: "Bangalore → Hyderabad (KA-01-F-1004)", category: "SCHEDULE_DELAY", title: "Bus reached boarding point 35 mins late at Hebbal", status: "RESOLVED", sla: "Met SLA", priority: "MEDIUM" },
  { id: "TKT-8803", passenger: "Praveen Nair", phone: "+91 98450 34012", trip: "Bangalore → Goa (KA-01-F-1007)", category: "LUGGAGE_DAMAGE", title: "Trolley handle damaged in undercarriage boot", status: "PENDING_COMPENSATION", sla: "4h remaining", priority: "HIGH" },
  { id: "TKT-8804", passenger: "Saritha V.", phone: "+91 98450 45123", trip: "Chennai → Madurai (KA-01-F-1011)", category: "CREW_BEHAVIOR", title: "Conductor was courteous and provided extra blanket", status: "CLOSED", sla: "Compliment", priority: "LOW" },
  { id: "TKT-8805", passenger: "Anil Kulkarni", phone: "+91 98450 56234", trip: "Bangalore → Coimbatore (KA-01-F-1015)", category: "REFUND_REQUEST", title: "Cancelled 6 hours prior, refund credited only 50%", status: "INVESTIGATING", sla: "6h remaining", priority: "MEDIUM" },
];

function ComplaintsContent() {
  const [complaints, setComplaints] = useState(SAMPLE_COMPLAINTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const filtered = complaints.filter((c) => {
    const matchesCat = categoryFilter === "ALL" || c.category === categoryFilter;
    const matchesSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.passenger.toLowerCase().includes(search.toLowerCase()) ||
      c.trip.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Passenger Grievance Redressal Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer Complaint Tickets, SLA Timers & Operational Corrective Action Tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs rounded-lg">
            96.4% SLA Compliance
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Grievances</div>
          <div className="text-2xl font-black text-amber-600 mt-0.5">3 Open</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Under investigation</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg Resolution Time</div>
          <div className="text-2xl font-black text-blue-600 mt-0.5">2.8 Hours</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Within 4h SLA limit</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Top Category</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5">AC / Cooling</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Summertime peak queries</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Satisfied Redressal</div>
          <div className="text-2xl font-black text-emerald-600 mt-0.5">94.2%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Post-resolution feedback</div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["ALL", "AC_MALFUNCTION", "SCHEDULE_DELAY", "LUGGAGE_DAMAGE", "CREW_BEHAVIOR", "REFUND_REQUEST"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === cat
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat === "ALL" ? "All Categories" : cat.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Search & Complaints Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Passenger Grievance Tickets</h3>
            <p className="text-xs text-slate-500">Track resolution SLA and passenger communications</p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ticket ID, passenger, or bus..."
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
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Passenger & Contact</th>
                <th className="py-3 px-4">Trip & Bus</th>
                <th className="py-3 px-4">Category & Details</th>
                <th className="py-3 px-4">SLA Clock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{c.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{c.passenger}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{c.phone}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{c.trip}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{c.category.replace("_", " ")}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">{c.title}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                      {c.sla}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        c.status === "RESOLVED" || c.status === "CLOSED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {c.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => alert(`Opening grievance resolution thread for ${c.id}`)}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      Resolve
                    </button>
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

export default function ComplaintsPage() {
  return (
    <SessionProvider>
      <AdminLayout>
        <ComplaintsContent />
      </AdminLayout>
    </SessionProvider>
  );
}
