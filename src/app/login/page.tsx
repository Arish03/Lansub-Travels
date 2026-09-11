"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Bus,
  MapPin,
  TrendingUp,
  Users,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const DEMO_ACCOUNTS = [
  { label: "CEO / Owner", email: "ceo@nationaltravels.demo", badge: "Super Admin", icon: "👑" },
  { label: "Operations Manager", email: "ops@nationaltravels.demo", badge: "Control Room", icon: "🎯" },
  { label: "Fleet Manager", email: "fleet@nationaltravels.demo", badge: "Vehicles & IoT", icon: "🚌" },
  { label: "Finance Manager", email: "finance@nationaltravels.demo", badge: "P&L & Tolls", icon: "💰" },
  { label: "Booking Manager", email: "booking@nationaltravels.demo", badge: "Counters & OTAs", icon: "🎫" },
  { label: "HR Manager", email: "hr@nationaltravels.demo", badge: "Crew & Drivers", icon: "👥" },
];

const HIGHLIGHTS = [
  { title: "Live GPS & IoT Telemetry", desc: "Real-time tracking of 50+ luxury multi-axle buses" },
  { title: "OTA Channel Reconciliation", desc: "Unified inventory across redBus, AbhiBus & Counters" },
  { title: "Trip Profitability Engine", desc: "Real-time fuel, toll, crew allowance & margin per km" },
  { title: "AI Daily Operations Brief", desc: "Predictive delay alerts & dynamic pricing suggestions" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("ops@nationaltravels.demo");
  const [password, setPassword] = useState("demo@123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string>("ops@nationaltravels.demo");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials. Try selecting a demo account below.");
      } else {
        toast.success("Welcome to LANSUB TRAVEL OS!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(demoEmail: string) {
    setSelectedDemo(demoEmail);
    setEmail(demoEmail);
    setPassword("demo@123");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-md shadow-blue-500/20 mb-4">
            <Bus className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            LANSUB <span className="text-blue-600">TRAVEL OS</span>
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            Enterprise Fleet & Operations Platform • <span className="text-blue-700">National Travels</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Left Column: Platform Highlights */}
          <div className="md:col-span-5 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-8 text-white flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-blue-100 mb-6 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Next-Gen Bus ERP</span>
              </div>
              <h2 className="text-xl font-bold leading-snug mb-3">
                One Platform. Every Bus. Every Booking. Every Rupee.
              </h2>
              <p className="text-blue-100 text-xs leading-relaxed mb-6">
                Engineered specifically for intercity passenger transport operators in India.
              </p>

              <div className="space-y-4">
                {HIGHLIGHTS.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-blue-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-blue-200 text-[11px]">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-blue-500/30 text-[11px] text-blue-200 flex items-center justify-between">
              <span>National Travels Pilot • South India</span>
              <span className="font-semibold text-emerald-300">v2.5 Production</span>
            </div>
          </div>

          {/* Right Column: Login & Demo Selector */}
          <div className="md:col-span-7 p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Sign In to Dashboard</h3>
            <p className="text-xs text-slate-500 mb-5">
              Select a demo role below to instantly populate credentials, or enter custom details.
            </p>

            {/* Quick Demo Role Cards */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Quick Select Demo Role (Password: demo@123)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((acc) => {
                  const isSelected = selectedDemo === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => fillDemo(acc.email)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-center gap-2 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 text-blue-900"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700 hover:bg-slate-100/50"
                      }`}
                    >
                      <span className="text-lg">{acc.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold truncate">{acc.label}</div>
                        <div className="text-[10px] text-slate-500 truncate">{acc.badge}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-xs"
                  placeholder="name@nationaltravels.demo"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-xs pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    <span>Enter Operations Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-500">
          Lansub Technologies • National Travels ERP Suite • Secure Enterprise Access
        </div>
      </div>
    </div>
  );
}
