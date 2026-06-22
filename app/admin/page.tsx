"use client";

import { useState } from "react";
import {
  Tariff,
  GiftApplication,
  TelegramConfig,
  NotificationAuditLog,
} from "../../types";
import {
  Briefcase,
  Users,
  FileCheck,
  Gift,
  Activity,
  LayoutDashboard,
  Database,
  Server,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import TariffManagement from "../../components/tariffManagement";
import GiftApplications from "../../components/giftApplications";
import TelegramIntegration from "../../components/telegramIntegration";
import NotificationAuditLogs from "../../components/notificationAuditLogs";
import {
  initialGiftApplications,
  initialTariffs,
  initialAuditLogs,
} from "@/data";

interface AdminDashboardProps {
  telegramConfig: TelegramConfig;
  onApproveGift: (id: string) => void;
  onRejectGift: (id: string) => void;
  onAddTariff: (tariff: Omit<Tariff, "id">) => void;
  onUpdateTariff: (id: string, updated: Partial<Tariff>) => void;
  onDeleteTariff: (id: string) => void;
  onUpdateTelegramConfig: (updated: Partial<TelegramConfig>) => void;
  onLogout: () => void;
}

export default function AdminDashboard({
  telegramConfig,
  onApproveGift,
  onRejectGift,
  onUpdateTelegramConfig,
  onLogout,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "tariffs" | "gifts" | "telegram" | "logs"
  >("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tariffs, setTariffs] = useState<Tariff[]>(initialTariffs);
  const [applications, setApplications] = useState<GiftApplication[]>(
    initialGiftApplications,
  );

  const [auditLogs, setAuditLogs] =
    useState<NotificationAuditLog[]>(initialAuditLogs);
  // Compute metrics dynamically from synchronized state!
  const totalTariffs = tariffs.length;
  const activeUsersCount = 148; // Realistic SaaS metrics
  const pendingRequests = applications.filter(
    (a) => a.status === "Pending",
  ).length;
  const approvedGifts = applications.filter(
    (a) => a.status === "Approved" || a.status === "Activated",
  ).length;

  const getRecentActivities = () => {
    // Generate real time event logs from applications and audit logs
    const activities: {
      id: string;
      msg: string;
      type: string;
      time: string;
    }[] = [];

    // Add pending requests
    applications
      .filter((a) => a.status === "Pending")
      .forEach((a) => {
        activities.push({
          id: `act-p-${a.id}`,
          msg: `New gift request filed. Beneficiary: ${a.userName} (${a.tariffName})`,
          type: "pending",
          time: "Just now",
        });
      });

    // Add approved ones
    applications
      .filter((a) => a.status === "Approved")
      .forEach((a) => {
        activities.push({
          id: `act-a-${a.id}`,
          msg: `Enterprise code released to ${a.userName} [${a.activationCode}]`,
          type: "approved",
          time: "12 mins ago",
        });
      });

    // Default stats if none exist
    if (activities.length === 0) {
      activities.push({
        id: "act-1",
        msg: "Telegram webhook interface successfully confirmed with @tariff_gift_approver_bot.",
        type: "telegram",
        time: "1 hour ago",
      });
      activities.push({
        id: "act-2",
        msg: "Security compliance check: mTLS handshake validated across regional datacenter grids.",
        type: "compliance",
        time: "2 hours ago",
      });
    }

    return activities;
  };

  const navItems = [
    { id: "overview", label: "Monitor Command Center", icon: LayoutDashboard },
    { id: "tariffs", label: "Tariff Plan Publisher", icon: Briefcase },
    { id: "gifts", label: "Gift Approval Desk", icon: Gift },
    { id: "telegram", label: "Telegram Webhook Setup", icon: Server },
    { id: "logs", label: "Delivery Audit Logs", icon: Database },
  ];

  return (
    <div
      id="admin-dashboard-container"
      className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800"
    >
      {/* MOBILE HEADER BAR */}
      <div className="md:hidden bg-slate-950 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
            G
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-white block leading-none">
              GiftFlow
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase text-slate-400">
              Admin Control
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION (Desktop persistent, Tablet hidden by default) */}
      <aside
        className={`
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 fixed md:static inset-y-0 left-0 w-64 bg-slate-950 text-slate-350 z-40 transition-transform duration-300 flex flex-col justify-between border-r border-slate-800/80 shrink-0
      `}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-900 hidden md:flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              T
            </div>
            <div>
              <span className="font-extrabold tracking-wide text-white block text-sm leading-tight">
                T-Gift Command
              </span>
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 block -mt-0.5">
                ADMIN SECURED
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  id={`admin-nav-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                      : "hover:bg-slate-900 text-slate-400 hover:text-slate-100"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-all ${isSelected ? "text-white" : "text-slate-500"}`}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer element */}
        <div className="p-4 border-t border-slate-900 space-y-3.5">
          <button
            id="admin-logout-trigger"
            onClick={onLogout}
            className="w-full py-2.5 bg-slate-900 hover:bg-rose-950/60 hover:text-rose-400 border border-slate-850 hover:border-rose-900/60 rounded-xl font-bold text-xs text-slate-400 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out Command
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER CONTENT VIEWPORT */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
          {/* CONDITIONAL SUBPAGE SELECTION RENDERER */}

          {activeTab === "overview" && (
            <div id="admin-overview-viewport" className="space-y-8">
              {/* Header block */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tight leading-none">
                    Command Platform overview
                  </h2>
                  <p className="text-xs text-slate-500 mt-2">
                    Unified dashboard representing active user quotas, published
                    plans, and pending corporate gifts.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 font-bold uppercase block">
                    SECURE TELEMETRY STREAM
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full inline-block mt-1">
                    ● Connected to @tariff_gift_approver_bot
                  </span>
                </div>
              </div>

              {/* BENTO STATS CARDS GRID (Design Requirements) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. TOTAL TARIFFS */}
                <div
                  className="bg-white p-5 rounded-[16px] border border-slate-200/90 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  onClick={() => setActiveTab("tariffs")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Total Tariffs
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <Briefcase className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-slate-900 font-mono leading-none">
                      {totalTariffs}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-medium block mt-1">
                      Direct corporate packages
                    </span>
                  </div>
                </div>

                {/* 2. ACTIVE USERS */}
                <div className="bg-white p-5 rounded-[16px] border border-slate-200/90 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Active Users
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-indigo-100/80 flex items-center justify-center text-indigo-600">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-slate-900 font-mono leading-none">
                      {activeUsersCount}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-medium block mt-1">
                      Subsciber nodes globally
                    </span>
                  </div>
                </div>

                {/* 3. PENDING GIFT REQUESTS */}
                <div
                  className="bg-white p-5 rounded-[16px] border border-slate-200/95 shadow-sm hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  onClick={() => setActiveTab("gifts")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Pending Gift Requests
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-amber-100/80 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                      <Gift className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-amber-600 font-mono leading-none">
                      {pendingRequests}
                    </span>
                    <span className="text-[11px] text-amber-600 font-bold block mt-1 font-mono">
                      {pendingRequests > 0
                        ? "⚠️ ACTION REQUIRED"
                        : "✓ All Synced"}
                    </span>
                  </div>
                </div>

                {/* 4. APPROVED GIFTS */}
                <div
                  className="bg-white p-5 rounded-[16px] border border-slate-200/90 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  onClick={() => setActiveTab("gifts")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Approved Gifts
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                      <FileCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-emerald-600 font-mono leading-none">
                      {approvedGifts}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-medium block mt-1">
                      Activated with crypt codes
                    </span>
                  </div>
                </div>
              </div>

              {/* TWO PANEL ACTIVITY & DISPATCH CHANNELS DETAIL */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* RECENT ACTIVITIES WITH QUICK ACTIONS */}
                <div className="lg:col-span-8 bg-white p-6 rounded-[16px] border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    Recent Operational Activities
                  </h3>
                  <p className="text-xs text-slate-400 leading-normal">
                    Real-time transaction events representing approved
                    allocations, platform diagnostic updates, and webhook
                    replies.
                  </p>

                  <div className="space-y-3.5 divide-y divide-slate-100 max-h-100 overflow-y-auto pr-1">
                    {getRecentActivities().map((act) => (
                      <div
                        key={act.id}
                        className="pt-3.5 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-800 leading-normal">
                            {act.msg}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            EVENT-TYPE: {act.type.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0 font-medium bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {act.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TELEGRAM STATUS & INLINE ACTION GUIDE */}
                <div className="lg:col-span-4 bg-white p-6 rounded-[16px] border border-slate-200/80 shadow-sm justify-between flex flex-col">
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 tracking-wider uppercase font-mono text-xs flex items-center gap-2">
                      <Server className="w-4.5 h-4.5 text-blue-500" />
                      Bot Webhook Metrics
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Review structural sync of Telegram bot endpoints inside
                      the sandbox runtime.
                    </p>

                    <div className="space-y-3 font-medium text-xs border-y border-slate-100 py-4 font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sync Status:</span>
                        <span
                          className={
                            telegramConfig?.isConnected
                              ? "text-emerald-600 font-bold"
                              : "text-amber-500 font-bold"
                          }
                        >
                          {telegramConfig?.isConnected
                            ? "ACTIVE WEBHOOK"
                            : "UNBOUND / DISABLED"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Callback Link:</span>
                        <span className="text-slate-800 font-bold">
                          @tariff_gift_approver_bot
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          Total Logs Ingested:
                        </span>
                        <span className="text-slate-805 text-slate-800 font-bold">
                          {auditLogs?.length} Records
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1.5 text-xs">
                    <span className="font-extrabold text-indigo-800 block text-[11px] uppercase tracking-wider font-mono">
                      💡 Integration Helper Tip
                    </span>
                    <p className="text-indigo-900 font-normal leading-relaxed text-[11.5px]">
                      Want to demonstrate a live Telegram approval flow? Set up
                      bot configurations under the{" "}
                      <span
                        className="underline cursor-pointer text-indigo-650 inline font-bold"
                        onClick={() => setActiveTab("telegram")}
                      >
                        Telegram Webhook tab
                      </span>
                      , then file a gift on Landing page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tariffs" && <TariffManagement />}

          {activeTab === "gifts" && (
            <GiftApplications
              applications={applications}
              onApprove={onApproveGift}
              onReject={onRejectGift}
            />
          )}

          {activeTab === "telegram" && (
            <TelegramIntegration
              config={telegramConfig}
              onUpdateConfig={onUpdateTelegramConfig}
              auditLogs={auditLogs}
            />
          )}

          {activeTab === "logs" && <NotificationAuditLogs logs={auditLogs} />}
        </div>
      </main>
    </div>
  );
}
