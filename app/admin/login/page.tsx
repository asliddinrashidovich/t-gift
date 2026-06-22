"use client";

import React, { useState } from "react";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin123@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [errorText, setErrorText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorText(
        "Please supply credentials in both the Email and Password fields.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorText("");

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorText(error.message);
        return;
      }

      if (!data.user) {
        setErrorText("User not found");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        setErrorText(profileError.message);
        await supabase.auth.signOut();
        return;
      }

      if (profile.role !== "admin") {
        setErrorText("You are not authorized to access admin panel.");
        await supabase.auth.signOut();
        return;
      }

      router.push("/admin");
    } catch (err) {
      console.error(err);
      setErrorText("Unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutofill = () => {
    setEmail("admin@giftflow.io");
    setPassword("admin123");
  };

  return (
    <div
      id="admin-login-root"
      className="min-h-screen bg-slate-900 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 font-sans flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-87.5 bg-indigo-500/10 blur-[130px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Admin Console Login
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Secure billing tariff controllers and Telegram bot webhook dispatch
            layers.
          </p>
        </div>

        {/* Crisp Card and borders */}
        <div className="bg-slate-950 border border-slate-800 rounded-[16px] overflow-hidden shadow-2xl">
          {/* Top visual warning bar */}
          <div className="h-1 bg-indigo-600" />

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email input info */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 font-mono">
                  Administrator Email
                </label>
                <div className="relative">
                  <input
                    id="admin-email-field"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@giftflow.io"
                    className="w-full px-4 py-2.5 pl-10 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl text-slate-250 text-xs focus:outline-none transition-all placeholder:text-slate-600 focus:bg-slate-900/60 font-mono"
                  />
                  <Mail className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Password field input descriptor */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 font-mono">
                  Secret Credentials Key
                </label>
                <div className="relative">
                  <input
                    id="admin-password-field"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 pl-10 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl text-slate-250 text-xs focus:outline-none transition-all placeholder:text-slate-600 focus:bg-slate-900/60 font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {errorText && (
                <div className="p-3 bg-rose-950/50 border border-rose-900 text-rose-400 rounded-lg text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
                  <span>{errorText}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  id="admin-login-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  {isSubmitting
                    ? "Verifying scopes..."
                    : "Acknowledge Key & Enter"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
