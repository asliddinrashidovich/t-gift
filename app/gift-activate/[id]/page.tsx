"use client";

import React, { useState } from "react";
import { GiftApplication } from "../../../types";
import {
  ShieldCheck,
  Info,
  Sparkles,
  Check,
  ArrowRight,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

interface ActivationPageProps {
  giftApplications: GiftApplication[];
  onActivateSuccess: (code: string) => void;
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
}

export default function ActivationPage({
  onActivateSuccess,
}: ActivationPageProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<
    "idle" | "checking" | "success" | "error"
  >("idle");
  const [matchedApp, setMatchedApp] = useState<GiftApplication | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setStatus("error");
      setErrorMessage("Verification token input field cannot be blank.");
      return;
    }

    try {
      setStatus("checking");

      const { data, error } = await supabase
        .from("gift_applications")
        .select(
          `
        *,
        tariffs (
          id,
          name
        )
      `,
        )
        .eq("activation_code", code.trim().toUpperCase())
        .eq("status", "approved")
        .single();

      if (error || !data) {
        setStatus("error");
        setErrorMessage("Activation code not found or has already been used.");
        return;
      }

      const app: GiftApplication = {
        id: data.id,
        userName: data.user_id,
        userEmail: "",
        tariffName: data.tariffs?.name ?? "Unknown Tariff",
        status: data.status,
        appliedDate: data.created_at,
        activationCode: data.activation_code,
        approvedDate: data.approved_at,
        reason: data.reason,
      };

      setMatchedApp(app);
      setStatus("success");
    } catch (err) {
      console.error(err);

      setStatus("error");
      setErrorMessage("Unexpected server error occurred.");
    }
  };

  return (
    <div
      id="activation-page-root"
      className="min-h-screen bg-slate-50/60 py-20 px-4 sm:px-6 lg:px-8 font-sans text-slate-800"
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Gift Code Gateway Activation
          </h1>
        </div>

        {/* Dynamic Card Container */}
        <div className="bg-white border border-slate-200 shadow-xl rounded-[16px] overflow-hidden">
          {/* Edge decorative gradient bar */}
          <div className="h-1.5 w-full bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <div className="p-8">
            {status === "success" && matchedApp ? (
              <div
                id="activation-success-view"
                className="space-y-6 text-center animate-fade-in-up"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 mx-auto flex items-center justify-center text-emerald-600 border-4 border-emerald-50">
                  <Check className="w-8 h-8 font-black" />
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Code Validated Successfully!
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400 font-mono tracking-wider">
                    REGISTRY CODE: {matchedApp.activationCode}
                  </p>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl text-left border border-slate-150 space-y-3 font-medium text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-400">Beneficiary:</span>
                    <span className="text-slate-800 font-bold">
                      {matchedApp.userName}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-slate-400">
                      Subsidized Tariff Plan:
                    </span>
                    <span className="text-blue-600 font-bold">
                      {matchedApp.tariffName}
                    </span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-400">Approved Date:</span>
                    <span className="text-slate-800 font-mono">
                      {matchedApp.approvedDate?.slice(0, 10) || "2026-06-20"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    id="claim-reward-trigger"
                    onClick={() => router.push("/")}
                    className="flex-1 py-3 text-xs font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Go to home
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              // Standard Input Form or Error output
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 font-mono">
                    Enter Activation Code
                  </label>
                  <input
                    id="activation-input-field"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. ENTERPRISE-Q992-K54F"
                    disabled={status === "checking"}
                    className="w-full px-4 py-4 bg-slate-50 text-slate-900 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-center text-lg sm:text-xl font-bold font-mono tracking-widest placeholder:text-slate-300 focus:outline-none uppercase transition-all"
                  />
                </div>

                {status === "error" && (
                  <div
                    id="activation-error-state"
                    className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-850 text-xs text-left"
                  >
                    <X className="w-5 h-5 mt-0.5 text-rose-600 shrink-0" />
                    <div>
                      <p className="font-bold">
                        Activation Verification Blocked
                      </p>
                      <p className="mt-1 text-xs opacity-90 leading-relaxed">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="flex-1 py-3 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Go Back To Dashboard
                  </button>
                  <button
                    id="activation-verify-btn"
                    type="submit"
                    disabled={status === "checking"}
                    className="flex-1 py-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {status === "checking"
                      ? "Connecting edge lookup..."
                      : "Verify Activation Code"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
