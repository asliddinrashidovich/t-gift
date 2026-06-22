import React, { useState } from "react";
import { TelegramConfig, NotificationAuditLog } from "../types";
import {
  CheckCircle,
  RefreshCw,
  XCircle,
  Key,
  ShieldCheck,
  Clock,
  Layers,
} from "lucide-react";

export default function TelegramIntegration() {
  const [chatId, setChatId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectStatus, setConnectStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const [botToken, setBotToken] = useState("");

  const saveBotToken = async () => {
    await fetch("/api/telegram/save-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        botToken,
      }),
    });
  };

  const handleTestPing = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  const connectTelegram = async () => {
    const res = await fetch("/api/telegram/connect-admin", {
      method: "POST",
    });

    const data = await res.json();

    console.log(data);
  };

  return (
    <div id="telegram-integration-subpage" className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Telegram Bot Webhook Webby
        </h3>
        <p className="text-xs text-slate-500">
          Sync Telegram messenger interfaces with the central platform database
          to approve corporate gift requests inline.
        </p>
        <button onClick={connectTelegram}>Connect Telegram</button>
      </div>
      <input value={botToken} onChange={(e) => setBotToken(e.target.value)} />

      <button onClick={saveBotToken}>Save Token</button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: SETUP CONFIGURATION PORTAL */}
        <div className="lg:col-span-7 bg-white p-6 rounded-[16px] border border-slate-200/80 shadow-sm space-y-6">
          {/* <form onSubmit={handleConnect} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 font-mono flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-indigo-500" />
                Bot API Token Authentication Key
              </label>
              <input
                id="tg-token-input"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="e.g. 684930129:AAHd38fklGgSklB9_wK9gXks"
                className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200 focus:border-indigo-500 rounded-xl font-mono text-xs focus:outline-none transition-all placeholder:text-slate-350 focus:bg-white"
              />
              <p className="mt-1.5 text-[10px] text-slate-400">
                Generate this API token inside Telegram Messenger client through
                the verified official{" "}
                <strong className="text-slate-550">@BotFather</strong>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 font-mono">
                Approver Chat / Group ID Link
              </label>
              <input
                id="tg-chat-input"
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="e.g. -100483925583"
                className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200 focus:border-indigo-500 rounded-xl font-mono text-xs focus:outline-none transition-all placeholder:text-slate-350 focus:bg-white"
              />
              <p className="mt-1.5 text-[10px] text-slate-400">
                Pipes dispatch notifications to the designated private group
                channel or executive chat. Can represent a signed Group ID
                starting with -100.
              </p>
            </div>

            {connectStatus === "success" && (
              <div
                id="tg-success-feedback"
                className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3 text-emerald-800 text-xs"
              >
                <CheckCircle className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-bold">Sync Secured Seamlessly!</p>
                  <p className="mt-0.5 opacity-90">{feedbackMsg}</p>
                </div>
              </div>
            )}

            {connectStatus === "error" && (
              <div
                id="tg-error-feedback"
                className="p-4 bg-rose-50 border border-rose-105 rounded-xl flex items-start gap-3 text-rose-800 text-xs"
              >
                <XCircle className="w-5 h-5 mt-0.5 text-rose-500 shrink-0" />
                <div>
                  <p className="font-bold">Tunnel Connection Fail</p>
                  <p className="mt-0.5 opacity-90">{feedbackMsg}</p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-100">
              <button
                id="tg-ping-btn"
                type="button"
                onClick={handleTestPing}
                disabled={isLoading}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 hover:text-slate-850 rounded-xl text-xs font-semibold cursor-pointer select-none transition-all flex items-center gap-1.5"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
                />
                Issue Diagnostics Ping
              </button>
              <button
                id="tg-connect-btn"
                type="submit"
                disabled={isLoading}
                className="flex-1 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
              >
                {isLoading
                  ? "Confirming active webhook..."
                  : "Verify Token & Establish Webhook"}
              </button>
            </div>
          </form> */}
        </div>
      </div>
    </div>
  );
}
