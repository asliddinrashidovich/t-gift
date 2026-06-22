import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const update = await req.json();

  console.log("TELEGRAM UPDATE:", update);

  if (update.callback_query) {
    const data = update.callback_query.data;

    const [action, applicationId] = data.split(":");

    console.log("ACTION:", action);
    console.log("APPLICATION:", applicationId);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    if (action === "approve") {
      const code = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

      const { error } = await supabase
        .from("gift_applications")
        .update({
          status: "approved",
          activation_code: code,
          approved_at: new Date().toISOString(),
        })
        .eq("id", applicationId);

      console.log("APPROVE ERROR:", error);
    }

    if (action === "reject") {
      const { error } = await supabase
        .from("gift_applications")
        .update({
          status: "rejected",
        })
        .eq("id", applicationId);

      console.log("REJECT ERROR:", error);
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}