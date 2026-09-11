"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AlertTriangle, Shield, CheckCircle2, Clock,
  Filter, Search, ArrowRight,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Alert {
  id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
}

function AlertsContent() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/v1/alerts")
      .then((r) => r.json())
      .then((data) => {
        setAlerts(data.alerts || []);
        if (data.counts) setCounts(data.counts);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const filtered = alerts.filter((a) => {
    const matchesSeverity = severityFilter === "ALL" || a.severity === severityFilter;
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.message.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Incident & Telemetry Alert Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated GPS, Speed, Delay, Maintenance & Document Expiry Signals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs rounded-lg">
            {alerts.length} Total Telemetry Triggers
          </span>
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              severityFilter === sev
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {sev === "ALL" ? `All Alerts (${alerts.length})` : `${sev} (${counts[sev] || 0})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search alerts by bus, type, or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {filtered.length} alerts
        </div>
      </div>

      {/* Alerts Feed */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-600 text-sm font-semibold">Loading Alert Feed...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl p-8">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">All Operations Clear</h3>
          <p className="text-xs text-slate-500 mt-1">No unresolved alerts in this severity category.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((a) => {
            const isCritical = a.severity === "CRITICAL";
            const isHigh = a.severity === "HIGH";
            return (
              <div
                key={a.id}
                className={`bg-white border rounded-xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCritical ? "border-rose-300 ring-1 ring-rose-200/50" : "border-slate-200/90"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isCritical
                        ? "bg-rose-100 text-rose-700"
                        : isHigh
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{a.title}</h4>
                      <span
                        className={`inline-flex items-center px-2 py-0.2 rounded-full text-[10px] font-bold border ${
                          isCritical
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : isHigh
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {a.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{a.message}</p>
                    <div className="text-[11px] text-slate-400 mt-1 font-mono">
                      Timestamp: {formatDate(a.createdAt)} • Type: {a.type}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <button
                    onClick={() => {
                      setAlerts(alerts.map((item) => (item.id === a.id ? { ...item, isResolved: true } : item)));
                    }}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Resolve Incident
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AlertsPage() {
  return (
    <SessionProvider>
      <AdminLayout>
        <AlertsContent />
      </AdminLayout>
    </SessionProvider>
  );
}
