"use client";

import { redirect } from "next/navigation";
import { Tariff, GiftApplication } from "../types";
import { Gift, Zap, Check } from "lucide-react";
import Footer from "./footer";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getStatusBadgeStyles } from "@/lib/statusBadges";
import Navigation from "./navigation";
import { useRouter } from "next/navigation";
import { SkeletonCard } from "./cardSkeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

export default function LandingPage() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [giftApplications, setGiftApplications] = useState<GiftApplication[]>();
  const [userTariffs, setUserTariffs] = useState<any[]>([]);
  const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const activeTariffsOnly = tariffs?.filter((t) => t?.is_active);

  const getGiftStatus = (tariffId: string) => {
    const gift = giftApplications?.find((gift) => gift.tariff_id === tariffId);

    return gift?.status;
  };

  const isTariffActive = (tariffId: string) => {
    return userTariffs.some((tariff) => tariff.tariff_id == tariffId);
  };

  const handleBuyTariff = async (tariffId: string, periodMonths: number) => {
    try {
      const {
        data: { user: userSession },
      } = await supabase.auth.getUser();

      const activatedAt = new Date();

      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + periodMonths);

      await supabase.from("user_tariffs").insert({
        user_id: userSession?.id,
        tariff_id: tariffId,
        source: "purchase",
        activated_at: activatedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
      });
      setOpen(false);
      router.push(`/success_tariff/${tariffId}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleGift = async (tariff: Tariff) => {
    if (user?.email == "admin123@gmail.com") {
      redirect("/auth");
    } else {
      setSelectedTariff(tariff);
      setOpen(true);
    }
  };
  const handleApplyGift = async (tariffId: string) => {
    const {
      data: { user: userSession },
    } = await supabase.auth.getUser();

    if (user?.email == "admin123@gmail.com") {
      redirect("/auth");
    }

    // user email
    const userEmail = userSession?.email;

    // tariff ma'lumotini olish
    const { data: tariff } = await supabase
      .from("tariffs")
      .select("*")
      .eq("id", tariffId)
      .single();

    // application yaratish
    const { data: application, error } = await supabase
      .from("gift_applications")
      .insert({
        user_id: userSession?.id,
        tariff_id: tariffId,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    await fetch("/api/telegram/send-approval-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        applicationId: application.id,
        userEmail,
        tariffName: tariff?.name,
        reason: application.reason || "",
      }),
    });

    router.push(`/gift-activate`);
  };

  useEffect(() => {
    const fetchTariffs = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from("tariffs").select("*");

      if (error) {
        console.error(error);
        return;
      }

      setTariffs(data);
      setIsLoading(false);
    };

    fetchTariffs();
  }, []);

  useEffect(() => {
    const fetchGiftApplications = async () => {
      const {
        data: { user: userSession },
      } = await supabase.auth.getUser();

      if (!userSession) return;

      const { data, error } = await supabase
        .from("gift_applications")
        .select("*")
        .eq("user_id", userSession.id);

      if (error) {
        console.error(error);
        return;
      }

      setGiftApplications(data);
    };

    fetchGiftApplications();
  }, []);

  useEffect(() => {
    const fetchUserTariffs = async () => {
      const {
        data: { user: userSession },
      } = await supabase.auth.getUser();

      if (!userSession) return;

      const { data, error } = await supabase
        .from("user_tariffs")
        .select("*")
        .eq("user_id", userSession.id);

      if (error) {
        console.error(error);
        return;
      }

      setUserTariffs(data);
    };

    fetchUserTariffs();
  }, []);

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
    <div
      id="landing-page-container"
      className="min-h-screen bg-slate-50/50 text-slate-800 font-sans"
    >
      <Navigation />

      <section
        id="pricing-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/60"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Available Tariffs
          </h2>
        </div>

        {/* Database Tariffs Generation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTariffsOnly.map((tariff) => {
            const status = getGiftStatus(tariff.id);
            const activeTariff = isTariffActive(tariff.id);

            return (
              <div
                key={tariff.id}
                className="bg-white border border-slate-200 rounded-[16px] shadow-sm hover:shadow-xl transition-all duration-350 flex flex-col overflow-hidden relative group hover:border-blue-300"
              >
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                      {tariff.name}
                    </h3>
                  </div>

                  {/* Status badge representing user application status for this specific tariff */}
                  {status && (
                    <div className="mb-4">
                      <span className="text-[11px] font-mono tracking-wider uppercase">
                        Application:
                      </span>
                      <span
                        className={`ml-2 px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeStyles(status)}`}
                      >
                        {status?.charAt(0).toUpperCase() + status?.slice(1)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-baseline gap-1 mt-2 mb-6">
                    <span className="text-4xl font-extrabold text-slate-900">
                      ${tariff.price}
                    </span>
                    <span className="text-slate-400 text-sm font-medium">
                      / month
                    </span>
                    <span className="ml-2 text-xs font-mono font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                      {tariff.period_months}{" "}
                      {tariff.period_months === 1 ? "Month" : "Months"}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3.5 border-t border-slate-100 pt-5">
                    <div className="flex items-start gap-2.5 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                      <span>Premium Access</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                      <span>Priority Support</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                      <span>Extended Usage</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto flex flex-col gap-2.5">
                  <button
                    disabled={activeTariff}
                    id={`buy-tariff-${tariff.id}`}
                    onClick={() => handleGift(tariff)}
                    className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${
                      activeTariff
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed"
                        : "bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-400 hover:shadow-md cursor-pointer"
                    }`}
                  >
                    <Zap className="w-4 h-4" />

                    {activeTariff ? "Active Tariff" : "Buy Tariff Directly"}
                  </button>
                  {activeTariff ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl font-semibold text-sm bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-not-allowed"
                    >
                      Active On Account
                    </button>
                  ) : status === "pending" ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl font-semibold text-sm bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed"
                    >
                      Application Pending
                    </button>
                  ) : status === "approved" ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl font-semibold text-sm bg-blue-50 text-blue-700 border border-blue-200 cursor-not-allowed"
                    >
                      Gift Approved
                    </button>
                  ) : status === "activated" ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl font-semibold text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed"
                    >
                      Activated
                    </button>
                  ) : (
                    <button
                      id={`apply-gift-${tariff.id}`}
                      onClick={() => handleApplyGift(tariff.id)}
                      className="w-full py-2.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Gift className="w-4 h-4" />
                      Apply for Free Gift
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <p>Tariff: {selectedTariff?.name}</p>
            <p>Price: ${selectedTariff?.price}</p>
            <p>Duration: {selectedTariff?.period_months} month(s)</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button
              onClick={() =>
                selectedTariff &&
                handleBuyTariff(selectedTariff.id, selectedTariff.period_months)
              }
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}
