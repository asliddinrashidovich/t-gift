"use client";

import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { ArrowRight, LogIn } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

function Navigation() {
  const [user, setUser] = useState<User | null>(null);

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      alert("Logout failed");
      return;
    }

    window.location.href = "/";
  };

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();
  }, []);
  return (
    <nav
      id="landing-nav"
      className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <p>T</p>
            </div>
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-linear-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
              T-Gift
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {(user?.email == "admin123@gmail.com" || user) ? (
            <div className="flex items-center gap-3 pl-2 border-slate-200">
              <button
                id="nav-to-dashboard-btn"
                onClick={() => redirect("/gift-activate")}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Gift activation
              </button>
              <div className="flex items-center gap-2">
                <img
                  src={
                    user?.user_metadata.avatar_url ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
                  }
                  referrerPolicy="no-referrer"
                  alt={user?.user_metadata.name || "User Avatar"}
                  className="w-8 h-8 rounded-full border border-blue-200 object-cover"
                />
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-slate-700 truncate max-w-30">
                    {user?.user_metadata.name}
                  </p>
                  <button
                    onClick={onLogout}
                    className="text-[10px] text-slate-400 font-mono tracking-tight hover:text-rose-500 transition-colors block leading-none"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-2">
              <button
                id="nav-login-btn"
                onClick={() => redirect("/auth")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
