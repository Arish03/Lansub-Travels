"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  DollarSign, TrendingUp, TrendingDown, CreditCard,
  Building, Download, CheckCircle2, ArrowUpRight,
} from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils";

const EXPENSE_BREAKDOWN = [
  { category: "Diesel & Fuel Costs", amount: 4280000, pct: 42.8, color: "bg-blue-500" },
  { category: "Fleet Maintenance & Spares", amount: 1450000, pct: 14.5, color: "bg-amber-500" },
  { category: "Fastag Highway Tolls", amount: 980000, pct: 9.8, color: "bg-purple-500" },
  { category: "Driver & Crew Allowances (Bata)", amount: 1850000, pct: 18.5, color: "bg-emerald-500" },
  { category: "OTA & Agent Commissions (redBus, etc.)", amount: 1420000, pct: 14.2, color: "bg-rose-500" },
];

function FinanceContent() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Financial Operations & Daily Settlements
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            National Travels P&L Statement, Fastag Toll Reconciliations & Counter Cash Handover
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Downloading Monthly P&L Ledger (Excel)...")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Statement</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gross Bookings Intake</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5">₹1,48,20,000</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Last 30 Days</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Operating Costs</div>
          <div className="text-2xl font-black text-rose-600 mt-0.5">₹99,80,000</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Fuel, Crew, Tolls, OTA</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Net Operating Surplus</div>
          <div className="text-2xl font-black text-emerald-600 mt-0.5">₹48,40,000</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-0.5">32.6% EBITDA Margin</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Today&apos;s Bank Inflow</div>
          <div className="text-2xl font-black text-blue-600 mt-0.5">₹4,85,000</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Settled via Razorpay & UPI</div>
        </div>
      </div>

      {/* Operating Expense Breakdown Cards */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Operating Cost Distribution (₹99.8 Lakhs)</h3>
        <p className="text-xs text-slate-500 mb-4">Direct operational expenditure allocated to 50 active buses</p>

        <div className="space-y-3">
          {EXPENSE_BREAKDOWN.map((exp) => (
            <div key={exp.category} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-800">
                <span>{exp.category}</span>
                <span>
                  {formatCurrency(exp.amount)}{" "}
                  <span className="text-slate-400 font-normal">({exp.pct}%)</span>
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${exp.color} rounded-full`} style={{ width: `${exp.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Cash & Counter Reconciliation Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/80">
          <h3 className="text-sm font-bold text-slate-900">Branch Counter Cash Reconciliation</h3>
          <p className="text-xs text-slate-500">Physical cash collections reconciled with bank deposits</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Branch Depot</th>
                <th className="py-3 px-4">Counter Clerk</th>
                <th className="py-3 px-4">Cash Collected</th>
                <th className="py-3 px-4">UPI / Card</th>
                <th className="py-3 px-4">Total Settled</th>
                <th className="py-3 px-4">Bank Deposit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {[
                { branch: "Bangalore Majestic Counter 1", clerk: "Suresh P.", cash: 84000, upi: 142000, total: 226000, status: "DEPOSITED" },
                { branch: "Bangalore Kalasipalyam Main", clerk: "Manjunath K.", cash: 112000, upi: 184000, total: 296000, status: "DEPOSITED" },
                { branch: "Chennai Koyambedu Terminal", clerk: "Saravanan V.", cash: 96000, upi: 135000, total: 231000, status: "DEPOSITED" },
                { branch: "Hyderabad Lakdikapul Counter", clerk: "Naresh R.", cash: 74000, upi: 118000, total: 192000, status: "PENDING_VERIFICATION" },
                { branch: "Salem Central Bus Stand", clerk: "Dhanapal M.", cash: 42000, upi: 68000, total: 110000, status: "DEPOSITED" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{row.branch}</td>
                  <td className="py-3.5 px-4 text-slate-700">{row.clerk}</td>
                  <td className="py-3.5 px-4 text-slate-800">{formatCurrency(row.cash)}</td>
                  <td className="py-3.5 px-4 text-slate-800">{formatCurrency(row.upi)}</td>
                  <td className="py-3.5 px-4 font-extrabold text-blue-700">{formatCurrency(row.total)}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        row.status === "DEPOSITED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {row.status}
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

export default function FinancePage() {
  return (
    <SessionProvider>
      <AdminLayout>
        <FinanceContent />
      </AdminLayout>
    </SessionProvider>
  );
}
