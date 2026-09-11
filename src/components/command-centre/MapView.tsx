"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom bus icons by status
function createBusIcon(status: string, selected: boolean = false) {
  const colors: Record<string, string> = {
    ACTIVE: "#10b981",
    IN_TRANSIT: "#3b82f6",
    IDLE: "#64748b",
    MAINTENANCE: "#f59e0b",
    BREAKDOWN: "#ef4444",
  };
  const color = colors[status] || colors.IDLE;
  const size = selected ? 36 : 28;

  return L.divIcon({
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border: 3px solid ${selected ? "white" : color + "80"};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px ${color}60;
      ${selected ? "box-shadow: 0 0 0 4px white30, 0 2px 8px " + color + "60;" : ""}
    ">
      <svg xmlns="http://www.w3.org/2000/svg" style="transform:rotate(45deg);width:${size * 0.45}px;height:${size * 0.45}px" viewBox="0 0 24 24" fill="white">
        <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM6 6h12v5H6V6z"/>
      </svg>
    </div>`,
    className: "custom-bus-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

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
  fuelLevel?: number;
  engineTemp?: number;
}

interface MapViewProps {
  vehicles: VehiclePosition[];
  selectedBusId?: string;
  onBusClick: (bus: VehiclePosition) => void;
  simRunning: boolean;
}

// Component to recenter map on selected bus
function MapController({ selectedBus }: { selectedBus: VehiclePosition | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (selectedBus?.latitude && selectedBus?.longitude) {
      map.flyTo([selectedBus.latitude, selectedBus.longitude], 13, { duration: 1 });
    }
  }, [selectedBus, map]);
  return null;
}

// GPS Simulator: moves buses along a simulated path
function useGpsSimulator(vehicles: VehiclePosition[], running: boolean) {
  const [simVehicles, setSimVehicles] = useState<VehiclePosition[]>(vehicles);
  const frameRef = useRef<number>(0);
  const prevVehiclesRef = useRef<VehiclePosition[]>([]);

  useEffect(() => {
    if (vehicles.length > 0 && prevVehiclesRef.current.length === 0) {
      prevVehiclesRef.current = vehicles;
      setSimVehicles(vehicles);
    }
  }, [vehicles]);

  useEffect(() => {
    if (!running) {
      setSimVehicles(prevVehiclesRef.current.length > 0 ? prevVehiclesRef.current : vehicles);
      return;
    }

    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setSimVehicles((prev) =>
        prev.map((v) => {
          if (v.status !== "ACTIVE" && v.status !== "IN_TRANSIT") return v;
          if (!v.latitude || !v.longitude) return v;

          // Simulate movement
          const latDelta = (Math.random() - 0.5) * 0.002;
          const lngDelta = (Math.random() - 0.5) * 0.002;
          const newSpeed = Math.max(20, Math.min(100, v.speed + (Math.random() - 0.5) * 10));

          return {
            ...v,
            latitude: v.latitude + latDelta,
            longitude: v.longitude + lngDelta,
            speed: newSpeed,
            lastUpdate: new Date().toISOString(),
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [running, vehicles]);

  return simRunning => running ? simVehicles : vehicles;
}

export default function MapView({ vehicles, selectedBusId, onBusClick, simRunning }: MapViewProps) {
  const [simPositions, setSimPositions] = useState<VehiclePosition[]>(vehicles);

  useEffect(() => {
    if (!simRunning) {
      setSimPositions(vehicles);
      return;
    }

    const interval = setInterval(() => {
      setSimPositions((prev) => {
        const base = prev.length > 0 ? prev : vehicles;
        return base.map((v) => {
          if (!["ACTIVE", "IN_TRANSIT", "DEPARTED", "BOARDING"].includes(v.status)) return v;
          if (!v.latitude || !v.longitude) return v;

          const latDelta = (Math.random() - 0.5) * 0.003;
          const lngDelta = (Math.random() - 0.5) * 0.003;
          const speedChange = (Math.random() - 0.5) * 8;

          return {
            ...v,
            latitude: v.latitude + latDelta,
            longitude: v.longitude + lngDelta,
            speed: Math.max(0, Math.min(100, v.speed + speedChange)),
            lastUpdate: new Date().toISOString(),
          };
        });
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [simRunning, vehicles]);

  useEffect(() => {
    if (!simRunning) setSimPositions(vehicles);
  }, [vehicles, simRunning]);

  const displayVehicles = simRunning ? simPositions : vehicles;
  const selectedBus = displayVehicles.find((v) => v.id === selectedBusId);

  // Center of India / Tamil Nadu
  const center: [number, number] = [12.5, 78.5];

  return (
    <MapContainer
      center={center}
      zoom={7}
      style={{ height: "100%", width: "100%", background: "#f8fafc" }}
      className="rounded-none"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={18}
      />
      
      {selectedBus && <MapController selectedBus={selectedBus} />}

      {displayVehicles.map((v) => {
        if (!v.latitude || !v.longitude) return null;
        return (
          <Marker
            key={v.id}
            position={[v.latitude, v.longitude]}
            icon={createBusIcon(v.status, v.id === selectedBusId)}
            eventHandlers={{ click: () => onBusClick(v) }}
          >
            <Popup>
              <div className="text-xs space-y-1 min-w-[140px]">
                <div className="font-bold text-sm">{v.vehicleCode}</div>
                <div className="text-gray-500">{v.vehicleNumber}</div>
                {v.route && <div>🛣️ {v.route}</div>}
                {v.driverName && <div>👤 {v.driverName}</div>}
                <div>🚀 {Math.round(v.speed)} km/h</div>
                {v.occupancyPct && <div>💺 {v.occupancyPct.toFixed(0)}% occupied</div>}
                {v.fuelLevel && <div>⛽ {v.fuelLevel.toFixed(0)}% fuel</div>}
                <div
                  className="mt-1 px-2 py-0.5 rounded text-xs font-bold text-center"
                  style={{
                    background: v.status === "BREAKDOWN" ? "#fee2e2" : v.status === "MAINTENANCE" ? "#fef3c7" : "#d1fae5",
                    color: v.status === "BREAKDOWN" ? "#b91c1c" : v.status === "MAINTENANCE" ? "#92400e" : "#065f46",
                  }}
                >
                  {v.status}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
