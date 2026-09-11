"use client";

import { useState, useRef, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Bot, Send, Sparkles, Bus, DollarSign, TrendingUp, Users, MapPin, Wrench, Zap, Clock, BarChart3 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  data?: Record<string, unknown>;
  timestamp: Date;
}

const SUGGESTIONS = [
  { icon: DollarSign, text: "What is today's revenue?", category: "Finance" },
  { icon: Bus, text: "How many buses are active right now?", category: "Fleet" },
  { icon: TrendingUp, text: "Show most profitable route this month", category: "Analytics" },
  { icon: Users, text: "Which driver has the best safety score?", category: "HR" },
  { icon: MapPin, text: "Any buses in breakdown today?", category: "Operations" },
  { icon: Wrench, text: "What maintenance is due this week?", category: "Maintenance" },
  { icon: BarChart3, text: "What's the average occupancy last 30 days?", category: "Analytics" },
  { icon: Zap, text: "Which route has lowest occupancy today?", category: "Operations" },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-white border border-slate-200 rounded-2xl w-fit shadow-xs">
      <Bot className="w-4 h-4 text-blue-600 mr-1" />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
      <span className="text-xs text-slate-400 font-medium ml-1">Analyzing database...</span>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs ${
          isUser ? "bg-blue-600 text-white" : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
        }`}
      >
        {isUser ? (
          <span className="text-xs font-extrabold">U</span>
        ) : (
          <Bot className="w-4.5 h-4.5" />
        )}
      </div>
      <div className={`max-w-[82%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
            isUser
              ? "bg-blue-600 text-white rounded-tr-xs shadow-xs"
              : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-xs"
          }`}
        >
          <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
        </div>
        <div className="text-slate-400 text-[10px] px-1 font-mono">
          {msg.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

async function processQuery(query: string): Promise<{ content: string }> {
  const res = await fetch("/api/v1/ai/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return res.json();
}

function AICopilotContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm your LANSUB AI Operations Copilot for National Travels. 🚌

I have real-time access to the live SQLite operations database and can answer queries regarding:
• Fleet — 50 buses status, GPS positions, fuel levels, sensor alarms
• Trips & Schedules — live departure occupancy, route delays
• Reservations & Finance — channel breakdowns, OTA fees, route net margins
• HR & Drivers — 100 driver safety rankings, attendance rates

How can I assist your operations today? Choose a prompt below or type your question.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(text?: string) {
    const query = text || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await processQuery(query);
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: res.content || "I retrieved the operations data for your request.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an issue retrieving operations data. Please try another query.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-slate-900">
                Lansub AI Fleet Copilot
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Connected to National Travels DB
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Natural language operations assistant for control room managers & executives
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions Pills */}
      <div className="p-3 border-t border-slate-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s.text)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-700 whitespace-nowrap transition-all cursor-pointer disabled:opacity-50"
            >
              <s.icon className="w-3.5 h-3.5 text-blue-600" />
              <span>{s.text}</span>
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="Ask about active buses, route profits, delays, revenue, or drivers..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AICopilotPage() {
  return (
    <SessionProvider>
      <AdminLayout>
        <AICopilotContent />
      </AdminLayout>
    </SessionProvider>
  );
}
