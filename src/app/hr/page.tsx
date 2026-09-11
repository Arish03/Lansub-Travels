"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Briefcase, Users, CheckCircle2, Clock, Calendar,
  Search, Shield, DollarSign, UserCheck, AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const DEPARTMENTS = [
  { name: "Pilots & Drivers", count: 100, present: 96, color: "bg-blue-500" },
  { name: "Conductors & Attendants", count: 180, present: 172, color: "bg-purple-500" },
  { name: "Mechanics & Technicians", count: 85, present: 80, color: "bg-amber-500" },
  { name: "Booking & Counter Clerks", count: 140, present: 135, color: "bg-emerald-500" },
  { name: "Depot Supervisors & Ops", count: 65, present: 63, color: "bg-cyan-500" },
  { name: "HQ Administration & Accounts", count: 130, present: 124, color: "bg-indigo-500" },
];

const SAMPLE_STAFF = [
  { id: "EMP-1001", name: "Ramesh Babu", role: "Senior Pilot", dept: "Pilots & Drivers", branch: "Bangalore Central", status: "PRESENT", phone: "+91 98450 12345" },
  { id: "EMP-1002", name: "Suresh Kumar", role: "Conductor", dept: "Conductors", branch: "Bangalore Central", status: "PRESENT", phone: "+91 98450 23456" },
  { id: "EMP-1003", name: "Mohan Raj", role: "Lead Diesel Mechanic", dept: "Mechanics", branch: "Hosur Road Workshop", status: "PRESENT", phone: "+91 98450 34567" },
  { id: "EMP-1004", name: "Priya Sharma", role: "Counter Supervisor", dept: "Booking & Clerks", branch: "Majestic Counter", status: "PRESENT", phone: "+91 98450 45678" },
  { id: "EMP-1005", name: "Anand Verma", role: "Operations Lead", dept: "Depot Ops", branch: "Salem Transit Hub", status: "ON_LEAVE", phone: "+91 98450 56789" },
  { id: "EMP-1006", name: "Venkatesh Murthy", role: "Pilot", dept: "Pilots & Drivers", branch: "Hyderabad Depot", status: "REST", phone: "+91 98450 67890" },
];

function HRContent() {
  const [search, setSearch] = useState("");
  const filtered = SAMPLE_STAFF.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.branch.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Human Resources & Crew Roster
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            700+ Employees Across Karnataka, Tamil Nadu, Andhra Pradesh & Telangana
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs rounded-lg">
            95.1% Today&apos;s Attendance
          </span>
        </div>
      </div>

      {/* HR Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Headcount</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5">700+ Staff</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across 25 Depots & Counters</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Present on Duty</div>
          <div className="text-2xl font-black text-emerald-600 mt-0.5">670 Staff</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Biometric verified</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Monthly Payroll</div>
          <div className="text-2xl font-black text-blue-600 mt-0.5">₹1.85 Cr</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Salaries + Driver Allowances</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">On Approved Leave</div>
          <div className="text-2xl font-black text-amber-600 mt-0.5">18 Staff</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Relief crew dispatched</div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {DEPARTMENTS.map((dept) => (
          <div key={dept.name} className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">{dept.name}</span>
              <span className="text-xs font-extrabold text-slate-900">{dept.count} Staff</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full ${dept.color} rounded-full`}
                style={{ width: `${(dept.present / dept.count) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>Present Today: {dept.present}</span>
              <span className="text-emerald-600 font-bold">
                {Math.round((dept.present / dept.count) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Key Staff & Station In-Charges</h3>
            <p className="text-xs text-slate-500">Live operational attendance and branch placement</p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search staff..."
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
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Depot / Branch</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Today&apos;s Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{s.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                  <td className="py-3 px-4 text-slate-800">{s.role}</td>
                  <td className="py-3 px-4 text-slate-600">{s.dept}</td>
                  <td className="py-3 px-4 text-slate-600">{s.branch}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">{s.phone}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        s.status === "PRESENT"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : s.status === "ON_LEAVE"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {s.status.replace("_", " ")}
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

export default function HRPage() {
  return (
    <SessionProvider>
      <AdminLayout>
        <HRContent />
      </AdminLayout>
    </SessionProvider>
  );
}
