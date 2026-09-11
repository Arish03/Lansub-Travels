"use client";

import { useEffect, useState, useCallback } from "react";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Bus, AlertTriangle, TrendingUp, MapPin, Clock, Zap, Activity,
  Play, Pause, Square, Settings2, ChevronDown, X, Wifi, WifiOff,
  Thermometer, Battery, Gauge, Navigation, Users, DollarSign,
} from "lucide-react";
import { formatCurrency, formatPercent, formatTime, getOccupancyColor } from "@/lib/utils";

// Dynamic import for Leaflet (SSR incompatible)
const MapView = dynamic(() => import("@/components/command-centre/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-slate-100 rounded-xl">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 text-sm font-semibold">Loading live GPS fleet map...</p>
      </div>
    </div>
  ),
});

interface VehiclePosition {
  id: string;
  vehicleCode: string;
  vehicleNumber: string;
  model: string;
  status: string;
  latitude: number;
  longitude: number;
  speed: number;
  lastUpdate: string;
  driverName?: string;
  route?: string;
  origin?: string;
  destination?: string;
  occupancyPct?: number;
  bookedSeats?: number;
  totalSeats?: number;
  fuelLevel?: number;
  engineTemp?: number;
  batteryVoltage?: number;
  tripStatus?: string;
  delayMinutes?: number;
  scheduledDeparture?: string;
  tripId?: string;
}

interface DashStats {
  activeTrips: number;
  todayRevenue: number;
  avgOccupancy: number;
  criticalAlerts: number;
  busesOnRoute: number;
  busesIdle: number;
  busesMaintenance: number;
  busesBreakdown: number;
}

function BusDetailPanel({ bus, onClose }: { bus: VehiclePosition; onClose: () => void }) {
  const statusBadges: Record<string, string> = {
    ACTIVE: "text-emerald-700 bg-emerald-50 border-emerald-200",
    IN_TRANSIT: "text-blue-700 bg-blue-50 border-blue-200",
    IDLE: "text-slate-700 bg-slate-100 border-slate-200",
    MAINTENANCE: "text-amber-700 bg-amber-50 border-amber-200",
    BREAKDOWN: "text-rose-700 bg-rose-50 border-rose-200",
  };

  return (
    <div className="bg-white border-l border-slate-200 w-80 flex-shrink-0 flex flex-col overflow-y-auto shadow-lg z-10">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
        <div>
          <div className="text-slate-900 font-extrabold text-base">{bus.vehicleCode}</div>
          <div className="text-slate-500 text-xs font-mono">{bus.vehicleNumber}</div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Status */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${statusBadges[bus.status] || statusBadges.IDLE}`}>
          <div className={`w-2 h-2 rounded-full ${bus.status === "ACTIVE" || bus.status === "IN_TRANSIT" ? "animate-pulse bg-emerald-500" : "bg-slate-400"}`} />
          {bus.status.replace("_", " ")}
          {bus.delayMinutes && bus.delayMinutes > 0 ? ` • +${bus.delayMinutes}m delay` : ""}
        </div>

        {/* Route info */}
        {bus.origin && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-blue-600" />
              Assigned Route
            </div>
            <div className="flex items-center gap-2">
              <div className="text-slate-800 text-xs font-bold">{bus.origin}</div>
              <div className="flex-1 flex items-center">
                <div className="flex-1 h-px bg-slate-300" />
                <Bus className="w-3 h-3 text-blue-600 mx-1" />
                <div className="flex-1 h-px bg-slate-300" />
              </div>
              <div className="text-slate-800 text-xs font-bold">{bus.destination}</div>
            </div>
            {bus.scheduledDeparture && (
              <div className="text-[11px] text-slate-500 mt-2">
                Departure: {formatTime(bus.scheduledDeparture)}
              </div>
            )}
          </div>
        )}

        {/* Driver */}
        {bus.driverName && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="w-9 h-9 bg-blue-100 border border-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-700 text-sm font-bold">{bus.driverName.charAt(0)}</span>
            </div>
            <div>
              <div className="text-slate-900 text-xs font-bold">{bus.driverName}</div>
              <div className="text-slate-500 text-[11px]">Primary Pilot</div>
            </div>
          </div>
        )}

        {/* Speed & Occupancy metrics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-slate-900">{Math.round(bus.speed)}</div>
            <div className="text-xs text-slate-500 font-semibold">Speed (km/h)</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-slate-900">{bus.occupancyPct?.toFixed(0) || "—"}%</div>
            <div className="text-xs text-slate-500 font-semibold">Occupancy</div>
          </div>
        </div>

        {/* Telemetry Sensor readings */}
        {(bus.fuelLevel || bus.engineTemp || bus.batteryVoltage) && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="text-[11px] text-slate-600 font-bold uppercase tracking-wider mb-2.5">
              IoT Sensor Telemetry
            </div>
            <div className="space-y-2.5">
              {bus.fuelLevel && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <Gauge className="w-3.5 h-3.5 text-amber-500" />
                      Diesel Tank
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {bus.fuelLevel.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        bus.fuelLevel < 25 ? "bg-rose-500" : bus.fuelLevel < 50 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${bus.fuelLevel}%` }}
                    />
                  </div>
                </div>
              )}

              {bus.engineTemp && (
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                    <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                    Engine Coolant
                  </div>
                  <span className={`text-xs font-bold ${bus.engineTemp > 100 ? "text-rose-600" : "text-slate-800"}`}>
                    {bus.engineTemp.toFixed(1)}°C
                  </span>
                </div>
              )}

              {bus.batteryVoltage && (
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                    <Battery className="w-3.5 h-3.5 text-blue-500" />
                    Battery Output
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {bus.batteryVoltage.toFixed(1)}V
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GPS Details */}
        <div className="text-[11px] text-slate-500 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          📍 Lat: {bus.latitude?.toFixed(4)}, Lon: {bus.longitude?.toFixed(4)}
          <br />
          🕐 Ping: {bus.lastUpdate ? new Date(bus.lastUpdate).toLocaleTimeString("en-IN") : "—"}
        </div>
      </div>
    </div>
  );
}

function CommandCentreContent() {
  const [vehicles, setVehicles] = useState<VehiclePosition[]>([]);
  const [stats, setStats] = useState<DashStats | null>(null);
  const [selectedBus, setSelectedBus] = useState<VehiclePosition | null>(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [simRunning, setSimRunning] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/gps/vehicles");
      const data = await res.json();
      setVehicles(data.vehicles || []);
      setStats(data.stats);
      setLastUpdate(new Date());
    } catch (e) {
      console.error("GPS fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
    const interval = setInterval(fetchVehicles, simRunning ? 3000 : 15000);
    return () => clearInterval(interval);
  }, [fetchVehicles, simRunning]);

  const filteredVehicles = vehicles.filter((v) => {
    if (filterStatus === "ALL") return v.latitude && v.longitude;
    if (filterStatus === "ON_ROUTE") return ["IN_TRANSIT", "DEPARTED", "BOARDING"].includes(v.status) && v.latitude;
    return v.status === filterStatus && v.latitude;
  });

  const alertVehicles = vehicles.filter(
    (v) =>
      v.status === "BREAKDOWN" ||
      (v.engineTemp && v.engineTemp > 105) ||
      (v.fuelLevel && v.fuelLevel < 15)
  );

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Top control & ticker bar */}
      <div className="flex items-center gap-4 px-4 py-3 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-900 font-extrabold text-xs tracking-wider uppercase">
            Live Fleet Control Room
          </span>
          <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 text-[11px] font-mono">
            {lastUpdate ? lastUpdate.toLocaleTimeString("en-IN") : "—"}
          </span>
        </div>

        {/* Stats ticker */}
        <div className="flex-1 flex items-center gap-4 overflow-x-auto">
          {stats && [
            { label: "Active Trips", value: stats.activeTrips, color: "text-blue-600" },
            { label: "On Route", value: stats.busesOnRoute, color: "text-emerald-600" },
            { label: "Standby", value: stats.busesIdle, color: "text-slate-600" },
            { label: "Workshop", value: stats.busesMaintenance, color: "text-amber-600" },
            { label: "Breakdown", value: stats.busesBreakdown, color: "text-rose-600" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 whitespace-nowrap text-xs">
              <span className="text-slate-500 font-medium">{s.label}:</span>
              <span className={`font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* GPS Simulator controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setSimRunning(!simRunning)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
              simRunning
                ? "bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100"
                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20"
            }`}
          >
            {simRunning ? <><Pause className="w-3.5 h-3.5" /> Pause Sim</> : <><Play className="w-3.5 h-3.5" /> Start GPS Sim</>}
          </button>
        </div>
      </div>

      {/* Alert banner if breakdown or hot engine */}
      {alertVehicles.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 bg-rose-50 border-b border-rose-200 flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <div className="flex items-center gap-3 overflow-x-auto text-xs">
            {alertVehicles.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedBus(v)}
                className="whitespace-nowrap text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                🚨 {v.vehicleCode}: {v.status === "BREAKDOWN" ? "BREAKDOWN" : v.engineTemp && v.engineTemp > 105 ? `Engine ${v.engineTemp.toFixed(0)}°C` : "Low Diesel"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Map & Fleet sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — bus list */}
        <div className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
          {/* Status filter tabs */}
          <div className="p-2.5 border-b border-slate-200 bg-slate-50/50">
            <div className="flex gap-1 flex-wrap">
              {["ALL", "ON_ROUTE", "IDLE", "MAINTENANCE", "BREAKDOWN"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    filterStatus === f
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  {f === "ON_ROUTE" ? "Active" : f === "ALL" ? `All (${vehicles.length})` : f}
                </button>
              ))}
            </div>
          </div>

          {/* List of buses */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-slate-400 text-xs font-semibold">Loading buses...</div>
            ) : filteredVehicles.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-semibold">No buses in this category</div>
            ) : (
              filteredVehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedBus(selectedBus?.id === v.id ? null : v)}
                  className={`w-full text-left p-3 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                    selectedBus?.id === v.id ? "bg-blue-50/70 border-l-4 border-l-blue-600" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-900 text-xs font-bold">{v.vehicleCode}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        v.status === "BREAKDOWN"
                          ? "bg-rose-100 text-rose-800"
                          : v.status === "MAINTENANCE"
                          ? "bg-amber-100 text-amber-800"
                          : v.status === "IDLE"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>
                  {v.route && <div className="text-slate-600 text-[11px] truncate font-medium">{v.route}</div>}
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                    <span>{Math.round(v.speed)} km/h</span>
                    {v.occupancyPct && (
                      <span className="font-semibold text-blue-600">{v.occupancyPct.toFixed(0)}% full</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Map View */}
        <div className="flex-1 relative bg-slate-100">
          <MapView
            vehicles={filteredVehicles}
            selectedBusId={selectedBus?.id}
            onBusClick={(bus) => setSelectedBus(selectedBus?.id === bus.id ? null : bus)}
            simRunning={simRunning}
          />

          {/* Floating Map KPI Overlay in Light Theme */}
          {stats && (
            <div className="absolute top-4 right-4 space-y-2 pointer-events-none z-10">
              <div className="bg-white/95 border border-slate-200 rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  Live Fleet Active
                </div>
                <div className="text-3xl font-black text-slate-900">{vehicles.length}</div>
                <div className="text-xs font-medium text-slate-500">Buses tracked via GPS</div>
              </div>

              {stats.busesBreakdown > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-2 shadow-md pointer-events-auto">
                  <div className="text-rose-700 font-bold text-xs">
                    🚨 {stats.busesBreakdown} Active Breakdown{stats.busesBreakdown > 1 ? "s" : ""}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Bus detail panel */}
        {selectedBus && (
          <BusDetailPanel bus={selectedBus} onClose={() => setSelectedBus(null)} />
        )}
      </div>
    </div>
  );
}

export default function CommandCentrePage() {
  return (
    <SessionProvider>
      <AdminLayout>
        <CommandCentreContent />
      </AdminLayout>
    </SessionProvider>
  );
}
