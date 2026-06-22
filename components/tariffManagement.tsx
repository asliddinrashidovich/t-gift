import React, { useEffect, useState } from "react";
import { Tariff } from "../types";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function TariffManagement() {

  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTariffs = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("tariffs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTariffs(data || []);
    } catch (error) {
      console.error("Fetch tariffs error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTariffs();
  }, []);

  async function onCreateTariff(tariff: {
    name: string;
    price: number;
    durationMonths: number;
    isActive: boolean;
  }) {
    const { data, error } = await supabase
      .from("tariffs")
      .insert([
        {
          name: tariff.name,
          price: tariff.price,
          period_months: tariff.durationMonths,
          is_active: tariff.isActive,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Create tariff error:", error);
      throw error;
    }

    await fetchTariffs();
    return data;
  }

  async function onUpdateTariff(
    id: string,
    updated: {
      name?: string;
      price?: number;
      durationMonths?: number;
      isActive?: boolean;
    },
  ) {
    const payload: any = {};

    if (updated.name !== undefined) payload.name = updated.name;
    if (updated.price !== undefined) payload.price = updated.price;
    if (updated.durationMonths !== undefined)
      payload.period_months = updated.durationMonths;
    if (updated.isActive !== undefined) payload.is_active = updated.isActive;

    const { data, error } = await supabase
      .from("tariffs")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update tariff error:", error);
      throw error;
    }
    
    await fetchTariffs();
    return data;
  }

  async function onDeleteTariff(id: string) {
    const { error } = await supabase.from("tariffs").delete().eq("id", id);

    if (error) {
      console.error("Delete tariff error:", error);
      throw error;
    }

    await fetchTariffs();
    return true;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTariffId, setEditingTariffId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState(29);
  const [duration, setDuration] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingTariffId(null);
    setName("");
    setPrice(29);
    setDuration(1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tariff: Tariff) => {
    setEditingTariffId(tariff.id);
    setName(tariff.name);
    setPrice(tariff.price);
    setDuration(tariff.period_months);
    setIsActive(tariff.is_active);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingTariffId) {
      onUpdateTariff(editingTariffId, {
        name: name.trim(),
        price,
        durationMonths: duration,
        isActive,
      });
    } else {
      onCreateTariff({
        name: name.trim(),
        price,
        durationMonths: duration,
        isActive,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div id="tariff-mgmt-subpage" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Tariff Management
          </h3>
        </div>
        <button
          id="btn-create-tariff-open"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Create New Tariff
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-slate-200 rounded-[16px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10.5px] uppercase font-mono tracking-wider">
                <th className="py-4 px-6 font-semibold">Tariff Plan Title</th>
                <th className="py-4 px-6 font-semibold">Pricing Cost</th>
                <th className="py-4 px-6 font-semibold">Validity Span</th>
                <th className="py-4 px-6 font-semibold">Status Role</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {tariffs.map((tariff) => (
                <tr
                  key={tariff.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">
                      {tariff.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      PLAN-ID: {tariff.id}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-sm font-bold text-slate-900">
                    ${tariff.price}
                    <span className="text-slate-400 font-normal text-xs font-sans">
                      /mo
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-600">
                    {tariff.period_months}{" "}
                    {tariff.period_months === 1 ? "Month" : "Months"}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      id={`status-toggle-${tariff.id}`}
                      onClick={() =>
                        onUpdateTariff(tariff.id, {
                          isActive: !tariff.is_active,
                        })
                      }
                      className="cursor-pointer"
                      title="Click to toggle active status"
                    >
                      {tariff.is_active ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10.5px] flex items-center gap-1 w-fit font-bold">
                          <Eye className="w-3.5 h-3.5 text-emerald-500" />
                          Visible / Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-[10.5px] flex items-center gap-1 w-fit font-bold">
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                          Hidden / Inactive
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right space-x-1 whitespace-nowrap">
                    <button
                      id={`edit-tariff-${tariff.id}`}
                      onClick={() => handleOpenEdit(tariff)}
                      className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1 transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      id={`delete-tariff-${tariff.id}`}
                      onClick={() => onDeleteTariff(tariff.id)}
                      className="p-1 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-150 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CREATE / EDIT TARIFF */}
      {isModalOpen && (
        <div
          id="tariff-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-md p-4 animate-fade-in"
        >
          <div className="bg-white border border-slate-200 shadow-2xl rounded-[16px] max-w-lg w-full overflow-hidden animate-slide-in">
            <div className="h-1.5 w-full bg-blue-600" />
            <div className="p-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
                <h4 className="font-extrabold text-slate-900 text-base">
                  {editingTariffId
                    ? " Customize Plan Metrics"
                    : "Create New Tariff"}
                </h4>
                <button
                  id="close-tariff-modal"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Plan Name */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                    Tariff Name / Label
                  </label>
                  <input
                    id="form-tariff-name"
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Enterprise Scale Pro"
                    className="w-full px-3.5 py-2 border border-slate-200 focus:border-blue-500 rounded-lg text-xs font-semibold text-slate-850 focus:outline-none transition-all"
                  />
                </div>

                {/* Price and Duration Side by Side */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                      Price Cost (USD / term)
                    </label>
                    <div className="relative">
                      <input
                        id="form-tariff-price"
                        required
                        type="number"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full px-3.5 py-2 pl-8 border border-slate-200 focus:border-blue-500 rounded-lg text-xs font-mono font-bold text-slate-850 focus:outline-none transition-all"
                      />
                      <DollarSign className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                      Duration Span Limit
                    </label>
                    <div className="relative">
                      <select
                        id="form-tariff-duration"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full px-3.5 py-2 pl-8 border border-slate-200 focus:border-blue-500 rounded-lg text-xs font-bold text-slate-850 focus:outline-none transition-all"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                          <option key={m} value={m}>
                            {m} {m === 1 ? "month" : "months"}
                          </option>
                        ))}
                      </select>
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>
                </div>

                {/* Active Toggle Status inside Tariff */}
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">
                      Default Visibility Active
                    </span>
                    <span className="text-[10.5px] text-slate-400 block">
                      Torn active, it appears instantly on the Landing / Home
                      Pricing grid.
                    </span>
                  </div>
                  <button
                    id="form-tariff-active-toggle"
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className="cursor-pointer text-indigo-650"
                  >
                    {isActive ? (
                      <ToggleRight className="w-10 h-10 text-blue-600" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-slate-350" />
                    )}
                  </button>
                </div>


                {/* Form CTA Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-150">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="form-tariff-submit"
                    type="submit"
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition-colors text-xs font-semibold cursor-pointer"
                  >
                    {editingTariffId
                      ? "Apply Amendments"
                      : "Publish Subscription Tariff"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
