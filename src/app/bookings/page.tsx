"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Ticket, Search, Filter, ArrowRight, CheckCircle2,
  AlertCircle, DollarSign, Download, Phone, Mail,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Booking {
  id: string;
  pnr: string;
  channel: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  route: string;
  busCode: string;
  seats: string;
  passengerCount: number;
  amount: number;
  bookingStatus: string;
  paymentStatus: string;
  date: string;
  departure: string;
}

const CHANNEL_BADGES: Record<string, { label: string; class: string }> = {
  WEBSITE: { label: "Website", class: "bg-blue-50 text-blue-700 border-blue-200" },
  APP: { label: "Mobile App", class: "bg-purple-50 text-purple-700 border-purple-200" },
  COUNTER: { label: "Counter Booking", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  AGENT: { label: "Agent Counter", class: "bg-amber-50 text-amber-700 border-amber-200" },
  REDBUS: { label: "redBus OTA", class: "bg-rose-50 text-rose-700 border-rose-200" },
  ABHIBUS: { label: "AbhiBus OTA", class: "bg-orange-50 text-orange-700 border-orange-200" },
  PHONE: { label: "Phone Booking", class: "bg-cyan-50 text-cyan-700 border-cyan-200" },
};

function BookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetch("/api/v1/bookings")
      .then((r) => r.json())
      .then((data) => {
        setBookings(data.bookings || []);
        setTotalCount(data.totalCount || 0);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const filtered = bookings.filter((b) => {
    const matchesChannel = channelFilter === "ALL" || b.channel === channelFilter;
    const matchesSearch =
      b.pnr.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerPhone.includes(search) ||
      b.route.toLowerCase().includes(search.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Booking & Reservation Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unified inventory across Direct Channels, National Travels Counters, redBus & AbhiBus OTAs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs rounded-lg">
            {totalCount.toLocaleString()} Total Reservations
          </span>
        </div>
      </div>

      {/* Channel Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["ALL", "WEBSITE", "APP", "COUNTER", "AGENT", "REDBUS", "ABHIBUS"].map((ch) => (
          <button
            key={ch}
            onClick={() => setChannelFilter(ch)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              channelFilter === ch
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {ch === "ALL" ? "All Channels" : CHANNEL_BADGES[ch]?.label || ch}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by PNR, passenger name, phone, or route..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {filtered.length} bookings
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">PNR Number</th>
                <th className="py-3 px-4">Passenger Info</th>
                <th className="py-3 px-4">Route & Travel Date</th>
                <th className="py-3 px-4">Seats</th>
                <th className="py-3 px-4">Booking Channel</th>
                <th className="py-3 px-4">Fare Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Loading reservation records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No bookings found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => {
                  const chBadge = CHANNEL_BADGES[b.channel] || {
                    label: b.channel,
                    class: "bg-slate-100 text-slate-700 border-slate-200",
                  };
                  return (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {b.pnr}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{b.customerName}</div>
                        <div className="text-[11px] text-slate-500">{b.customerPhone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{b.route}</div>
                        <div className="text-[11px] text-slate-400">{formatDate(b.departure)}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {b.seats}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${chBadge.class}`}>
                          {chBadge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {formatCurrency(b.amount)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            b.bookingStatus === "BOOKED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : b.bookingStatus === "CANCELLED"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details Modal / Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Electronic Passenger Ticket
                </span>
                <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                  PNR: {selectedBooking.pnr}
                </div>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Passenger Name</span>
                <span className="font-bold text-slate-900">{selectedBooking.customerName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Contact Number</span>
                <span className="font-semibold text-slate-800">{selectedBooking.customerPhone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Route</span>
                <span className="font-bold text-slate-900">{selectedBooking.route}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Seats Reserved</span>
                <span className="font-bold text-blue-600">{selectedBooking.seats}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Booking Channel</span>
                <span className="font-semibold text-slate-800">{selectedBooking.channel}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Total Fare Paid</span>
                <span className="font-extrabold text-slate-900 text-sm">{formatCurrency(selectedBooking.amount)}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 py-2 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Close Ticket
              </button>
              <button
                onClick={() => alert("Printing ticket for " + selectedBooking.pnr)}
                className="flex-1 py-2 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
              >
                Print Ticket (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingsPage() {
  return (
    <SessionProvider>
      <AdminLayout>
        <BookingsContent />
      </AdminLayout>
    </SessionProvider>
  );
}
