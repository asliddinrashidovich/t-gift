import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const update = await req.json();

    console.log("TELEGRAM UPDATE:", update);

    if (!update.callback_query) {
      return NextResponse.json({ ok: true });
    }

    const callbackData = update.callback_query.data;

    const [action, applicationId] = callbackData.split(":");

    console.log("ACTION:", action);
    console.log("APPLICATION:", applicationId);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Applicationni topamiz
    const { data: application, error: appError } = await supabase
      .from("gift_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (appError || !application) {
      console.error("APPLICATION ERROR:", appError);
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

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

      if (error) {
        console.error("APPROVE ERROR:", error);
        return NextResponse.json({ error }, { status: 500 });
      }

      console.log("APPROVED SUCCESS");

      // Email yuborish
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev", // yoki verified domain
          to: application.email,
          subject: "Gift Approved 🎉",
          html: `
            <h2>Gift Approved 🎉</h2>
            <p>Your activation code:</p>
            <h1>${code}</h1>
            <p>Go to Activation page and enter this code.</p>
          `,
        });

        console.log("EMAIL SENT:", application.email);
      } catch (emailError) {
        console.error("EMAIL ERROR:", emailError);
      }
    }

    if (action === "reject") {
      const { error } = await supabase
        .from("gift_applications")
        .update({
          status: "rejected",
        })
        .eq("id", applicationId);

      if (error) {
        console.error("REJECT ERROR:", error);
      }

      console.log("REJECTED SUCCESS");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}