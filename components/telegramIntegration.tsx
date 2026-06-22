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
import { initialAuditLogs } from "../data";

interface TelegramIntegrationProps {
  config: TelegramConfig;
  onUpdateConfig: (updated: Partial<TelegramConfig>) => void;
  auditLogs: NotificationAuditLog[];
}

export default function TelegramIntegration({
  config,
  onUpdateConfig,
}: TelegramIntegrationProps) {
  const [token, setToken] = useState(config?.botToken);
  const [chatId, setChatId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectStatus, setConnectStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const [auditLogs, setAuditLogs] =
    useState<NotificationAuditLog[]>(initialAuditLogs);

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

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim() || !token.includes(":")) {
      setConnectStatus("error");
      setFeedbackMsg(
        "Malformed token: Ensure the input conforms to Telegram Botfather specs (e.g. 123456789:ABCdefGhIJKlmNoPQ_RStuvW).",
      );
      return;
    }

    setIsLoading(true);
    setConnectStatus("idle");

    setTimeout(() => {
      setIsLoading(false);
      // Simulate validation handshake
      if (token.includes("invalid") || token.trim().length < 20) {
        setConnectStatus("error");
        setFeedbackMsg(
          "Handshake Failed: Bot API token could not be resolved or was recently revoked by Telegram Father.",
        );
        onUpdateConfig({ isConnected: false });
      } else {
        setConnectStatus("success");
        setFeedbackMsg(
          "Handshake Successful! Bot identity confirmed: @tariff_gift_approver_bot. Direct inline callback buttons bound.",
        );
        onUpdateConfig({
          botToken: token.trim(),
          approverChatId: chatId.trim() || "-100384725591",
          isConnected: true,
          botUsername: "tariff_gift_approver_bot",
          lastSyncTime: "2026-06-20 06:35:20",
        });
      }
    }, 950);
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

  const telegramLogs = auditLogs.filter((log) => log.channel === "Telegram");

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
          <form onSubmit={handleConnect} className="space-y-5">
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

            {/* DYNAMIC FEEDBACK RESPONSE MESSAGE */}
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
          </form>

          {/* Connected bot info card specs representation */}
          {config?.isConnected && (
            <div className="p-4 bg-indigo-50/50 border border-indigo-100/80 rounded-[12px] space-y-3 font-mono text-[11px] leading-relaxed">
              <div className="flex items-center gap-2 text-indigo-700 font-bold uppercase font-sans text-xs">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                Active Connection Parameters Verified:
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bound Bot Username:</span>
                <span className="text-indigo-800 font-semibold">
                  @{config?.botUsername}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Interactive Chat Group:</span>
                <span className="text-indigo-800 font-semibold">
                  {config?.approverChatId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Synced Timestamp:</span>
                <span className="text-slate-850 font-semibold">
                  {config?.lastSyncTime || "2026-06-20 06:35:20"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: COMPACT TELEGRAM LOG FEED */}
        <div className="lg:col-span-5 bg-white p-6 rounded-[16px] border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider font-mono text-xs">
              <Layers className="w-4 h-4 text-slate-400 shrink-0" />
              Telegram Dispatch Feed
            </h4>
            <p className="text-[11.5px] text-slate-400 leading-normal">
              Direct log of messages sent to Telegram Bot interfaces with
              telemetry status.
            </p>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {telegramLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-50 border border-slate-150 rounded-xl text-xs"
                >
                  <div className="flex items-center justify-between font-mono text-[9px] text-slate-400 mb-1">
                    <span>{log.timestamp}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                        log.status === "Sent"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-500"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                  <p className="font-bold text-slate-800">{log.action}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl mt-4">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0 font-bold" />
              Telegram bot automatically dispatches a unique code to email
              beneficiaries on successful approvals.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
