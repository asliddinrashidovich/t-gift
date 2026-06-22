"use client";

import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function Page() {
  const handleSignInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000",
      },
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div
        id="auth-modal-card"
        className="bg-white border border-slate-200 shadow-2xl rounded-[16px] max-w-md w-full overflow-hidden transform transition-transform duration-300 scale-100 relative"
      >
        <div className="p-8 pt-12 text-center">
          <button
            id="close-auth-modal-btn"
            onClick={() => redirect("/")}
            className="absolute top-5 left-5 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">
            Login
          </h3>
          <p className="mt-1.5 text-xs text-slate-400 font-medium">
            Welcome to T-Gift!
          </p>

          <p className="mt-4 text-xs text-slate-500 bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-left leading-normal font-medium">
            Simulated Identity Provider: Clicking{" "}
            <strong className="text-indigo-600">"Continue with Google"</strong>{" "}
            logs you in instantly as the registered subscriber{" "}
            <span className="text-slate-800 underline">
              asliddinrashidovich7@gmail.com
            </span>{" "}
            for the purpose of demonstrating live approvals.
          </p>

          <button
            id="google-identity-trigger"
            onClick={handleSignInWithGoogle}
            className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-sm rounded-xl hover:shadow-sm transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.103C18.22 1.838 15.47 1 12.24 1 6.05 1 1 6.05 1 12.24s5.05 11.24 11.24 11.24c6.458 0 10.766-4.538 10.766-10.957 0-.738-.078-1.3-.176-1.859h-10.59z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
