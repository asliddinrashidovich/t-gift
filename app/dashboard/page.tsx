"use client";

import React, { useState } from "react";
import { GiftApplication, UserSession, Tariff } from "../../types";
import {
  User,
  Calendar,
  Clock,
  Gift,
  ShieldAlert,
  ArrowRight,
  Key,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { initialTariffs, initialGiftApplications } from "../../data";
import { redirect } from "next/navigation";

interface UserDashboardProps {
  session: UserSession;
  applications: GiftApplication[];
  tariffs: Tariff[];
  onActivateCode: (code: string) => void;
  onNavigateToLanding: () => void;
  onNavigateToActivation: () => void;
  onLogout: () => void;
}

export default function UserDashboard({
  onActivateCode,
  onNavigateToLanding,
  onNavigateToActivation,
  onLogout,
}: UserDashboardProps) {
  const [code, setCode] = useState("");
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [tariffs, setTariffs] = useState<Tariff[]>(initialTariffs);
  const [applications, setApplications] = useState<GiftApplication[]>(
    initialGiftApplications,
  );

  const [session, setSession] = useState<UserSession>({
    email: "asliddinrashidovich7@gmail.com",
    name: "Asliddin Rashidovich",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop",
    role: "user",
    activeTariff: {
      name: "Developer Launchpad",
      expiresAt: "2026-07-20",
      daysRemaining: 30,
    },
  });

  // Filter application history to only show this user's records
  const userApps = applications.filter(
    (app) =>
      app.userEmail === (session.email || "asliddinrashidovich7@gmail.com"),
  );

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setErrorText(
        "Please enter your 16-character alphanumeric activation token.",
      );
      setSuccessText("");
      return;
    }
    setErrorText("");

    // Validate matching code in approved list
    const foundApp = applications.find(
      (app) =>
        app.activationCode?.toUpperCase() === code.trim().toUpperCase() &&
        app.status === "Approved",
    );

    if (foundApp) {
      onActivateCode(code.trim());
      setSuccessText("Congratulations! Code successfully validated.");
      setCode("");
    } else {
      // Check if it's already activated
      const alreadyUsed = applications.find(
        (app) =>
          app.activationCode?.toUpperCase() === code.trim().toUpperCase() &&
          app.status === "Activated",
      );
      if (alreadyUsed) {
        setErrorText("This code has already been claimed by a user.");
      } else {
        setErrorText(
          "Invalid code. Ensure the code exists, matches spelling, and is currently Approved.",
        );
      }
      setSuccessText("");
    }
  };

  const getTimelineTag = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          color: "text-amber-600 bg-amber-50 border-amber-200",
          label: "Pending Approval",
          desc: "Your request was dispatched to admins and Telegram approvers for manual confirmation.",
          step: 1,
        };
      case "Approved":
        return {
          color: "text-blue-600 bg-blue-50 border-blue-200",
          label: "Approved & Code Dispatched",
          desc: "Request approved! Paste the activation code below to activate your account benefits.",
          step: 2,
        };
      case "Rejected":
        return {
          color: "text-rose-600 bg-rose-50 border-rose-200",
          label: "Application Declined",
          desc: "Your request was declined by the administrator. Review criteria parameters and re-submit.",
          step: 3,
        };
      case "Activated":
        return {
          color: "text-emerald-600 bg-emerald-50 border-emerald-200",
          label: "Activated",
          desc: "Benefits are currently applied to your active profile session.",
          step: 4,
        };
      default:
        return {
          color: "text-slate-500 bg-slate-50 border-slate-200",
          label: "Default State",
          desc: "Review pipeline details.",
          step: 0,
        };
    }
  };

  return (
    <div
      id="user-dashboard-root"
      className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 font-sans text-slate-800"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation / Header block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                User Dashboard
              </h2>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => redirect("/")}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              Browse Pricing
            </button>
            <button
              id="dash-nav-to-activation"
              onClick={onNavigateToActivation}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Standalone Activation Page
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200/50 rounded-xl transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Top Grid: User Profile Cards & Active Tariff Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* USER PROFILE CARD */}
          <div className="lg:col-span-4 bg-white p-6 rounded-[16px] border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <img
                src={
                  session.avatarUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
                }
                referrerPolicy="no-referrer"
                alt="Account Avatar"
                className="w-14 h-14 rounded-full border-2 border-indigo-200 object-cover"
              />
              <div className="overflow-hidden">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md font-mono text-[10px] uppercase font-bold">
                  Corporate Tier
                </span>
                <p className="font-bold text-slate-900 text-lg leading-tight mt-1.5 truncate">
                  {session.name || "Asliddin Rashidovich"}
                </p>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {session.email || "asliddinrashidovich7@gmail.com"}
                </p>
              </div>
            </div>

            <div className="space-y-3 font-medium text-xs">
              <div className="flex justify-between text-slate-550">
                <span>Account Status:</span>
                <span className="font-semibold text-emerald-600 font-mono">
                  Active Verification Connected
                </span>
              </div>
              <div className="flex justify-between text-slate-550">
                <span>Organization Node:</span>
                <span className="text-slate-800 font-mono">
                  ASLIDDIN-RASHID-WORKPLACE
                </span>
              </div>
              <div className="flex justify-between text-slate-550">
                <span>Joined On:</span>
                <span className="text-slate-800 font-mono">2026-06-12</span>
              </div>
            </div>

            <div className="bg-linear-to-tr from-slate-900 to-indigo-950 p-4 rounded-xl text-white">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <Gift className="w-3.5 h-3.5" />
                Special Allowance
              </div>
              <p className="mt-2 text-xs text-indigo-200 leading-relaxed font-normal">
                Your organizational role grants you authorization to submit 1
                high-tier subsidized tariff gift per 60 days.
              </p>
            </div>
          </div>

          {/* ACTIVE TARIFF CARD WITH REMAINING DAYS */}
          <div className="lg:col-span-8 bg-white p-6 rounded-[16px] border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase font-mono block">
                    CURRENT STATE
                  </span>
                  <h3 className="text-2xl font-black text-slate-950 mt-1">
                    Active Subscription Tariff
                  </h3>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Access Granted Badge
                </span>
              </div>

              {session.activeTariff ? (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-xs text-slate-400 font-medium uppercase font-mono">
                      ACTIVE TARIFF TITLE
                    </p>
                    <p className="text-lg font-bold text-slate-900 mt-1 leading-snug">
                      {session.activeTariff.name}
                    </p>
                    <p className="text-[10px] text-indigo-500 font-mono mt-1 font-semibold">
                      Direct Verification Code Applied
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden">
                    <p className="text-xs text-slate-400 font-medium uppercase font-mono">
                      REMAINING VALIDITY
                    </p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <p className="text-2.5xl font-black text-slate-900 font-mono">
                        {session.activeTariff.daysRemaining}
                      </p>
                      <p className="text-xs text-slate-500 font-semibold">
                        Days
                      </p>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-blue-650 h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-600"
                        style={{
                          width: `${Math.min(100, (session.activeTariff.daysRemaining / 365) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-xs text-slate-400 font-medium uppercase font-mono">
                      EXPIRATION TIMESTAMP
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-2 font-mono flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      {session.activeTariff.expiresAt}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium italic">
                      Auto-expires at 12:00 PM UTC
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-8 bg-slate-50 border border-slate-200 border-dashed rounded-[16px] text-center max-w-xl mx-auto">
                  <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="font-bold text-slate-800 text-base">
                    No active subscription
                  </p>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    You do not hold an active tariff on your current session.
                    Please request a subsidized Corporate Gift Code or buy a
                    subscription directly from the menu.
                  </p>
                  <button
                    onClick={onNavigateToLanding}
                    className="mt-4 inline-flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    Select Tariff & Submit Request
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* ACTIVATION CODE FORM */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-indigo-500" />
                Claim Gift Activation Code Link
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                If your gift application status represents Approved, copy the
                generated hash code from the list below and enter it here.
              </p>

              <form
                onSubmit={handleCodeSubmit}
                className="mt-4 flex flex-col sm:flex-row gap-3"
              >
                <input
                  id="dashboard-code-input"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. STARTUP-A87F-X90B"
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-slate-800 text-sm font-semibold tracking-wider font-mono uppercase focus:outline-none transition-all placeholder:text-slate-300"
                />
                <button
                  id="dashboard-code-submit-btn"
                  type="submit"
                  className="px-6 py-3 bg-indigo-650 hover:bg-indigo-700 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:shadow-md transition-all cursor-pointer shrink-0"
                >
                  Verify & Activate
                </button>
              </form>

              {errorText && (
                <p className="mt-2 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  {errorText}
                </p>
              )}
              {successText && (
                <p className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  {successText}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: GIFT APPLICATION HISTORY & TIMELINE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* GIFT APPLICATION HISTORY */}
          <div className="lg:col-span-7 bg-white p-6 rounded-[16px] border border-slate-200/80 shadow-sm">
            <h3 className="font-bold text-lg text-slate-950 flex items-center gap-2">
              <Gift className="w-5 h-5 text-indigo-600" />
              Gift Application History ({userApps.length})
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Live updates of requested subscriptions, code listings, and
              approval status reviews.
            </p>

            <div className="mt-5 space-y-4 max-h-105 overflow-y-auto pr-1">
              {userApps.length === 0 ? (
                <div className="text-center p-8 bg-slate-50 border border-slate-100 rounded-xl">
                  <Gift className="w-8 h-8 text-slate-350 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-500">
                    No applications registered
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Your account has not filed any tariff gift application
                    requests so far.
                  </p>
                </div>
              ) : (
                userApps.map((app) => {
                  const tag = getTimelineTag(app.status);

                  return (
                    <div
                      key={app.id}
                      className="p-4 border border-slate-150 rounded-xl hover:border-blue-400 transition-colors bg-slate-50/50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="text-xs text-slate-400 font-medium">
                            TARIFF PLAN REQUESTED
                          </p>
                          <h4 className="font-bold text-sm text-slate-800 mt-0.5">
                            {app.tariffName}
                          </h4>
                        </div>
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full border shrink-0 ${tag.color}`}
                        >
                          {tag.label}
                        </span>
                      </div>

                      {app.reason && (
                        <p className="mt-2.5 text-xs text-slate-500 bg-white p-2 border border-slate-100 rounded-lg">
                          <strong className="text-slate-650 font-mono block text-[10px] tracking-wide uppercase">
                            Request Goal justification:
                          </strong>
                          "{app.reason}"
                        </p>
                      )}

                      {app.activationCode && (
                        <div className="mt-3 p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className="text-slate-400 font-medium font-mono text-[10px] block">
                              ACTIVATION CODE
                            </span>
                            <span className="font-bold text-indigo-700 font-mono text-xs">
                              {app.activationCode}
                            </span>
                          </div>
                          {app.status === "Approved" && (
                            <button
                              onClick={() => {
                                setCode(app.activationCode || "");
                                triggerToastScroll();
                              }}
                              className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold rounded-lg text-[10.5px] transition-colors cursor-pointer"
                            >
                              Copy to Form
                            </button>
                          )}
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-slate-400">
                        <span>Submitted: {app.appliedDate}</span>
                        {app.approvedDate && (
                          <span>Updated: {app.approvedDate}</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* GIFT STATUS TIMELINE DISPLAY */}
          <div className="lg:col-span-5 bg-white p-6 rounded-[16px] border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-slate-950 flex items-center gap-1.5">
                <Clock className="w-5 h-5 text-indigo-600" />
                Gift Status Timeline Guidance
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                How our bot-integrated Telegram automated approval channel
                functions step-by-step.
              </p>

              {/* TIMELINE DESIGN */}
              <div className="mt-6 space-y-6 pl-2 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {/* STEP 1 */}
                <div className="relative pl-10">
                  <div className="absolute left-3 top-1 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-indigo-50 flex items-center justify-center font-bold text-white text-[9px] font-mono">
                    1
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">
                    1. Apply for Subscription Subsidizing
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Select a plan from the list on the landing page and state
                    your business justification to open a session request.
                  </p>
                </div>

                {/* STEP 2 */}
                <div className="relative pl-10">
                  <div className="absolute left-3 top-1 w-4 h-4 rounded-full bg-slate-400/80 ring-4 ring-slate-50 flex items-center justify-center font-bold text-white text-[9px] font-mono">
                    2
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">
                    2. Dispatched to Telegram bot
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Your justification and identity metrics are piped to the
                    private Telegram channel through cryptographic webhook
                    handshakes.
                  </p>
                </div>

                {/* STEP 3 */}
                <div className="relative pl-10">
                  <div className="absolute left-3 top-1 w-4 h-4 rounded-full bg-slate-400/80 ring-4 ring-slate-50 flex items-center justify-center font-bold text-white text-[9px] font-mono">
                    3
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">
                    3. Admin Evaluation Trigger
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    The direct peer team reviews and clicks Approved/Rejected
                    inside the Telegram Messenger client directly.
                  </p>
                </div>

                {/* STEP 4 */}
                <div className="relative pl-10">
                  <div className="absolute left-3 top-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-50 flex items-center justify-center font-bold text-white text-[9px] font-mono">
                    ✓
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">
                    4. Code Release & Activation
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Retrieve the released Activation Code on this dashboard page
                    or via email and submit above to trigger access.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 p-4 border border-slate-100 rounded-xl text-center text-xs">
              <span className="font-semibold text-slate-700 block text-[11px] mb-1">
                💡 Need quick debugging help?
              </span>
              <p className="text-slate-450 leading-relaxed font-normal">
                Admins can toggle, edit, or approve requests immediately inside
                the{" "}
                <strong
                  className="text-indigo-600 cursor-pointer hover:underline"
                  onClick={() => triggerScrollToControlPanel()}
                >
                  Admin Dashboard Workspace
                </strong>{" "}
                at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function triggerToastScroll() {
    const input = document.getElementById("dashboard-code-input");
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  // Helper mechanism to help review engineers navigate
  function triggerScrollToControlPanel() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const btn = document.getElementById("navbar-admin-btn");
    if (btn) btn.click();
  }
}
