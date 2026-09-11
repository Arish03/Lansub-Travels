"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Users, Star, Phone, Mail, Award, Search,
  TrendingUp, Ticket, MessageSquare,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const SAMPLE_CUSTOMERS = [
  { id: "CUST-001", name: "Dr. Vikram Sethi", phone: "+91 98450 11223", email: "vikram.sethi@gmail.com", trips: 28, spend: 36400, preferredRoute: "Bangalore ↔ Chennai", tier: "PLATINUM" },
  { id: "CUST-002", name: "Ananya Deshmukh", phone: "+91 98450 22334", email: "ananya.d@outlook.com", trips: 19, spend: 24700, preferredRoute: "Bangalore ↔ Hyderabad", tier: "GOLD" },
  { id: "CUST-003", name: "Karthik Subramanian", phone: "+91 98450 33445", email: "karthik.subbu@yahoo.com", trips: 24, spend: 31200, preferredRoute: "Bangalore ↔ Coimbatore", tier: "PLATINUM" },
  { id: "CUST-004", name: "Deepa Nair", phone: "+91 98450 44556", email: "deepa.nair@hotmail.com", trips: 14, spend: 18200, preferredRoute: "Bangalore ↔ Goa", tier: "GOLD" },
  { id: "CUST-005", name: "Rohan Kulkarni", phone: "+91 98450 55667", email: "rohan.k@techcorp.in", trips: 8, spend: 10400, preferredRoute: "Bangalore ↔ Pune", tier: "SILVER" },
  { id: "CUST-006", name: "Sneha Reddy", phone: "+91 98450 66778", email: "sneha.reddy@gmail.com", trips: 12, spend: 15600, preferredRoute: "Hyderabad ↔ Tirupati", tier: "SILVER" },
];

function CustomersContent() {
  const [search, setSearch] = useState("");

  const filtered = SAMPLE_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.preferredRoute.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Customer CRM & Loyalty Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            500 Frequent Passenger Profiles • Lifetime Value, Loyalty Tiers & Travel Preferences
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 font-bold text-xs rounded-lg">
            National Club Rewards
          </span>
        </div>
      </div>

      {/* CRM Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Registered Travelers</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5">500+ Profiles</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Direct & App accounts</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Platinum & Gold Members</div>
          <div className="text-2xl font-black text-purple-600 mt-0.5">142 Members</div>
          <div className="text-[11px] text-purple-600 font-semibold mt-0.5">&gt; 15 Trips / Year</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Repeat Booking Rate</div>
          <div className="text-2xl font-black text-emerald-600 mt-0.5">68.4%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">High loyalty retention</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg Customer Spend</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5">₹18,400</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Annualized per passenger</div>
        </div>
      </div>

      {/* Search & Directory Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Passenger Loyalty Directory</h3>
            <p className="text-xs text-slate-500">Traveler contact info and route preferences</p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by passenger name or phone..."
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
                <th className="py-3 px-4">Passenger Name</th>
                <th className="py-3 px-4">Phone & Email</th>
                <th className="py-3 px-4">Preferred Route</th>
                <th className="py-3 px-4">Total Trips</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Loyalty Tier</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 font-mono text-[11px]">{c.phone}</div>
                    <div className="text-slate-400 text-[10px]">{c.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-blue-700">{c.preferredRoute}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{c.trips} Trips</td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">{formatCurrency(c.spend)}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        c.tier === "PLATINUM"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : c.tier === "GOLD"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      ★ {c.tier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => alert(`Sending WhatsApp booking link to ${c.phone}`)}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      WhatsApp
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

export default function CustomersPage() {
  return (
    <SessionProvider>
      <AdminLayout>
        <CustomersContent />
      </AdminLayout>
    </SessionProvider>
  );
}
