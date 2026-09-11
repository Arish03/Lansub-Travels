"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Route as RouteIcon, MapPin, Clock, ArrowRight, Search,
  TrendingUp, Bus, DollarSign, ExternalLink,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface RouteData {
  id: string;
  routeCode: string;
  name: string;
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  baseFare: number;
  totalTrips: number;
  stopsCount: number;
  stops: Array<{ name: string; order: number; km: number }>;
}

function RoutesContent() {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);

  useEffect(() => {
    fetch("/api/v1/routes")
      .then((r) => r.json())
      .then((data) => {
        setRoutes(data.routes || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const filtered = routes.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.origin.toLowerCase().includes(search.toLowerCase()) ||
      r.destination.toLowerCase().includes(search.toLowerCase()) ||
      r.routeCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Route Master & Network</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            20 High-Demand South India Intercity Routes • Distances, Boarding Stops & Base Fares
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs rounded-lg">
            {routes.length} Active Routes
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search routes by city (e.g. Bangalore, Chennai, Goa)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {filtered.length} of {routes.length} routes
        </div>
      </div>

      {/* Routes Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-600 text-sm font-semibold">Loading Route Master...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <div
              key={r.id}
              onClick={() => setSelectedRoute(r)}
              className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {r.routeCode}
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">
                    {formatCurrency(r.baseFare)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm font-black text-slate-900 mb-2">
                  <span>{r.origin}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{r.destination}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Distance</span>
                    <span className="font-bold text-slate-800">{r.distance} km</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Duration</span>
                    <span className="font-bold text-slate-800">{Math.floor(r.duration / 60)}h {r.duration % 60}m</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>{r.stopsCount} Boarding Stops</span>
                <span className="text-blue-600 font-bold hover:underline flex items-center gap-0.5">
                  View Stops <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Route Stops Modal */}
      {selectedRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  {selectedRoute.routeCode}
                </span>
                <div className="text-lg font-black text-slate-900">
                  {selectedRoute.origin} → {selectedRoute.destination}
                </div>
              </div>
              <button
                onClick={() => setSelectedRoute(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Intermediate Boarding & Drop Stops ({selectedRoute.stops.length})
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedRoute.stops.map((stop, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                        {stop.order}
                      </div>
                      <span className="font-semibold text-slate-800">{stop.name}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">{stop.km} km</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedRoute(null)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RoutesPage() {
  return (
    <SessionProvider>
      <AdminLayout>
        <RoutesContent />
      </AdminLayout>
    </SessionProvider>
  );
}
