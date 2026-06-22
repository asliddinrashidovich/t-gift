import { useEffect, useState } from "react";
import { Search, Check, X, ShieldAlert, Calendar, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function GiftApplications() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);

    const { data: applicationsData, error } = await supabase.from(
      "gift_applications",
    ).select(`
      *,
      tariffs (
        id,
        name,
        price,
        period_months
      )
    `);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    if (!applicationsData?.length) {
      setApplications([]);
      setLoading(false);
      return;
    }

    const userIds = applicationsData.map((app) => app.user_id);

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .in("id", userIds);

    if (profilesError) {
      console.error(profilesError);
    }

    const formattedApplications = applicationsData.map((app) => {
      const profile = profiles?.find((p) => p.id === app.user_id);

      return {
        ...app,

        userEmail: profile?.email || "No Email",

        userName:
          profile?.full_name || profile?.email?.split("@")[0] || "Unknown User",

        tariffName: app.tariffs?.name || "Unknown Tariff",

        appliedDate: new Date(app.created_at).toLocaleDateString(),

        activationCode: app.activation_code,

        approvedDate: app.approved_at
          ? new Date(app.approved_at).toLocaleDateString()
          : null,
      };
    });

    setApplications(formattedApplications);
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleApprove = async (
    applicationId: string,
    userEmail: string,
    tariffName: string,
  ) => {
    const code = generateCode();

    const { error } = await supabase
      .from("gift_applications")
      .update({
        status: "approved",
        activation_code: code,
        approved_at: new Date().toISOString(),
      })
      .eq("id", applicationId);

    if (error) {
      console.error(error);
      return;
    }

    // Email yuborish
    await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        code,
      }),
    });

    // Telegram notification
    await fetch("/api/send-telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `
Gift Application Approved

User: ${userEmail}
Tariff: ${tariffName}
Code: ${code}

 ${new Date().toLocaleString()}
      `,
      }),
    });

    await fetchApplications();
  };

  const handleReject = async (applicationId: string) => {
    const { error } = await supabase
      .from("gift_applications")
      .update({
        status: "rejected",
      })
      .eq("id", applicationId);

    if (error) {
      console.error(error);
      return;
    }

    await fetchApplications();
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.userName.toLowerCase().includes(search.toLowerCase()) ||
      app.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      app.tariffName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" || app.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  console.log("asd", filteredApps);
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-55 bg-amber-50 text-amber-700 border-amber-200";
      case "approved":
        return "bg-blue-50 text-blue-700 border-blue-250";
      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "activated":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div id="gift-applications-subpage" className="space-y-6">
      {/* Title & subtitle block */}
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Corporate Gift Approval Desk
        </h3>
        <p className="text-xs text-slate-500">
          Admin desk to audit, approve, or reject subsidized corporative
          subscription packages.
        </p>
      </div>

      {/* FILTER AND SEARCH CONTROLS */}
      <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-[16px] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input field */}
        <div className="relative w-full md:max-w-md">
          <input
            id="app-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, billing email, or tariff name..."
            className="w-full px-3.5 py-2 pl-10 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        {/* Tab-style Horizontal Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-[10.5px] font-mono uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            FILTER STATUS:
          </span>
          {["All", "Pending", "Approved", "Rejected", "Activated"].map(
            (status) => (
              <button
                id={`filter-btn-${status}`}
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                  selectedStatus === status
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
                }`}
              >
                {status}
              </button>
            ),
          )}
        </div>
      </div>

      {/* DATA APPLICATIONS TABLE LIST */}
      <div className="bg-white border border-slate-200 rounded-[16px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto font-sans">
          {filteredApps.length === 0 ? (
            <div className="text-center py-16 px-4">
              <ShieldAlert className="w-12 h-12 text-slate-350 mx-auto mb-3" />
              <p className="font-bold text-slate-800 text-sm">
                No match found inside applications log
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No gift applications correspond to your search query or status
                filters inside this active container.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10.5px] uppercase font-mono tracking-wider">
                  <th className="py-4 px-6 font-semibold">
                    Subscriber Identity
                  </th>
                  <th className="py-4 px-6 font-semibold">
                    Subsidized Tariff Plan
                  </th>
                  <th className="py-4 px-6 font-semibold">Status Badge</th>
                  <th className="py-4 px-6 font-semibold">
                    Request justification
                  </th>
                  <th className="py-4 px-6 font-semibold">Release Code Info</th>
                  <th className="py-4 px-6 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredApps.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/40 transition-colors"
                  >
                    {/* Subscriber Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 font-mono text-xs">
                          {app.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-950 text-sm leading-tight">
                            {app.userName}
                          </div>
                          <div className="text-[10.5px] text-slate-405 font-mono text-slate-400 mt-0.5">
                            {app.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Tariff Plan detail */}
                    <td className="py-4 px-6">
                      <div
                        className="font-semibold text-slate-900 block truncate max-w-37.5"
                        title={app.tariffName}
                      >
                        {app.tariffName}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        Filed: {app.appliedDate}
                      </div>
                    </td>

                    {/* Status badge representing user application status */}
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeStyles(app.status)}`}
                      >
                        {app.status}
                      </span>
                    </td>

                    {/* App Reason */}
                    <td className="py-4 px-6 max-w-xs">
                      <p
                        className="italic text-slate-500 leading-normal line-clamp-2 text-[11.5px]"
                        title={app.reason}
                      >
                        "{app.reason || "No justification submitted."}"
                      </p>
                    </td>

                    {/* Code details */}
                    <td className="py-4 px-6">
                      {app.activationCode ? (
                        <div>
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 block w-fit">
                            {app.activationCode}
                          </span>
                          {app.approvedDate && (
                            <span className="text-[9.5px] text-slate-400 font-mono block mt-1">
                              Verified: {app.approvedDate}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">
                          Unassigned & Empty
                        </span>
                      )}
                    </td>

                    {/* Active actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-1">
                      {app.status === "pending" ? (
                        <>
                          <button
                            id={`approve-btn-${app.id}`}
                            onClick={() =>
                              handleApprove(
                                app.id,
                                app.userEmail,
                                app.tariffName,
                              )
                            }
                            className="p-1 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-250 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-all text-center"
                          >
                            <Check className="w-3.5 h-3.5 font-bold" />
                            Approve
                          </button>
                          <button
                            id={`reject-btn-${app.id}`}
                            onClick={() => handleReject(app.id)}
                            className="p-1 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-all text-center"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </>
                      ) : (
                        <div className="text-[10.5px] font-mono text-slate-400 flex items-center justify-end gap-1 font-semibold">
                          {app.status === "activated"
                            ? "✓ Benefit Activated"
                            : "● Action Stored"}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
