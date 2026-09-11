"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Settings, Building, Globe, Key, Shield, Bell,
  CheckCircle2, Save, ExternalLink,
} from "lucide-react";

function SettingsContent() {
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Platform Settings & Integrations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            National Travels Profile, OTA Channel APIs (redBus / AbhiBus), GPS Hardware & Gateways
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settings Saved
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Company Profile Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Building className="w-4.5 h-4.5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Operator Company Profile</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Trade Name</label>
              <input
                type="text"
                defaultValue="National Travels (Bangalore)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Headquarters Address</label>
              <input
                type="text"
                defaultValue="Majestic Bus Terminal Complex, Bangalore, KA - 560009"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">GSTIN Number</label>
              <input
                type="text"
                defaultValue="29AABCN1234F1Z8"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Website</label>
              <input
                type="text"
                defaultValue="https://www.nationaltravels.co.in"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
              />
            </div>
          </div>
        </div>

        {/* OTA Channel Integrations */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4.5 h-4.5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">OTA Inventory Channel Connectors</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* redBus */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="font-extrabold text-slate-900 text-sm">redBus Partner API</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live Connected
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Sync Interval: 15s</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">API Key / Operator Token</label>
                  <input
                    type="password"
                    defaultValue="rb_prod_national_sec_99481"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Commission Rate (%)</label>
                  <input
                    type="text"
                    defaultValue="9.5%"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* AbhiBus */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="font-extrabold text-slate-900 text-sm">AbhiBus OTA Connector</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live Connected
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Sync Interval: 30s</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Operator Merchant ID</label>
                  <input
                    type="text"
                    defaultValue="ABHI_NATIONAL_TRAVELS_BLR"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Commission Rate (%)</label>
                  <input
                    type="text"
                    defaultValue="8.5%"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Platform Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <SessionProvider>
      <AdminLayout>
        <SettingsContent />
      </AdminLayout>
    </SessionProvider>
  );
}
