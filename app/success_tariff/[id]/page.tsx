"use client";

import { supabase } from "@/lib/supabase/client";
import { Tariff } from "@/types";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessAccessPage() {
  const router = useRouter();
  const { id: tariffId } = useParams();
  const [tariffData, setTariffData] = useState<Tariff | null>(null);
  const getTariffData = async () => {
    try {
      const { data, error } = await supabase
        .from("tariffs")
        .select("*")
        .eq("id", tariffId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setTariffData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTariffData();
  }, [tariffId]);

  return (
    <div
      id="success-access-root"
      className="min-h-screen bg-linear-to-tr from-slate-50 via-slate-50 to-emerald-50/20 py-16 px-4 sm:px-6 lg:px-8 font-sans text-slate-800 flex items-center justify-center"
    >
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-25" />
          <div className="absolute -inset-4 bg-emerald-50 rounded-full animate-pulse opacity-50" />
          <div className="relative w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-white border-8 border-white shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-12 h-12" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
            Tariff Access Granted!
          </h1>
        </div>

        {/* PREMIUM SUCCESS WORKSPACE BILLING CARD */}
        <div className="bg-white border border-slate-200 shadow-xl rounded-[20px] overflow-hidden text-left">
          {/* Top colored status badge bar */}
          <div className="h-1 bg-emerald-500 w-full" />

          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  ACTIVATED PLAN
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {tariffData?.name}
                </h3>
              </div>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active Subscription
              </span>
            </div>

            <div className="bg-slate-50/50 p-4 border border-slate-150 rounded-xl space-y-2.5 font-medium text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Period months:</span>
                <span className="text-slate-800 font-mono">
                  {tariffData?.period_months || 0}
                  {tariffData?.period_months === 1 ? " month" : " months"}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Price:</span>
                <span className="text-emerald-700 font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-100">
                  {tariffData?.price ? `$${tariffData.price}` : "$0.00"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => router.push("/")}
            className="w-full sm:w-auto px-6 py-3 font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm"
          >
            <Home className="w-4 h-4 text-slate-400" />
            Go to Home Landing
          </button>
          <button
            id="success-dashboard-nav-btn"
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-auto px-6 py-3 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm"
          >
            Enter Subscriber Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Linear branding accent */}
        <div className="text-xs text-slate-400 font-mono pt-4">
          GFT-SECURE-HANDSHAKE-ID:{" "}
          {Math.random().toString(36).substring(2, 10).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
