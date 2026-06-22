"use client";

import { useState } from "react";
import { Briefcase, Gift, Server, LogOut } from "lucide-react";

import TariffManagement from "./tariffManagement";
import GiftApplications from "./giftApplications";
import TelegramIntegration from "./telegramIntegration";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"tariffs" | "gifts" | "telegram">(
    "tariffs",
  );
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
    { id: "tariffs", label: "Tariff Plan Publisher", icon: Briefcase },
    { id: "gifts", label: "Gift Approval Desk", icon: Gift },
    { id: "telegram", label: "Telegram Webhook Setup", icon: Server },
  ];
  const onLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        return;
      }

      router.replace("/admin/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      id="admin-dashboard-container"
      className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800"
    >
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
          {activeTab === "tariffs" && <TariffManagement />}
          {activeTab === "gifts" && <GiftApplications />}
          {activeTab === "telegram" && <TelegramIntegration />}
        </div>
      </main>
    </div>
  );
}
