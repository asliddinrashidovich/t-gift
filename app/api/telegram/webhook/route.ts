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
    console.log("APPLICATION ID:", applicationId);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Gift application
    const { data: application, error: applicationError } = await supabase
      .from("gift_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (applicationError || !application) {
      console.error("APPLICATION ERROR:", applicationError);

      return NextResponse.json(
        {
          success: false,
          error: "Application not found",
        },
        { status: 404 }
      );
    }

    console.log("APPLICATION:", application);

    // User profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", application.user_id)
      .single();

    if (profileError || !profile) {
      console.error("PROFILE ERROR:", profileError);

      return NextResponse.json(
        {
          success: false,
          error: "Profile not found",
        },
        { status: 404 }
      );
    }

    console.log("PROFILE:", profile);

    if (action === "approve") {
      const code = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

      const { error: approveError } = await supabase
        .from("gift_applications")
        .update({
          status: "approved",
          activation_code: code,
          approved_at: new Date().toISOString(),
        })
        .eq("id", applicationId);

      if (approveError) {
        console.error("APPROVE ERROR:", approveError);

        return NextResponse.json(
          {
            success: false,
            error: approveError.message,
          },
          { status: 500 }
        );
      }

      console.log("APPLICATION APPROVED");

      try {
        const emailResult = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: profile.email,
          subject: "Gift Application Approved 🎉",
          html: `
            <div style="font-family: Arial, sans-serif">
              <h2>Gift Application Approved 🎉</h2>

              <p>Hello ${profile.full_name || "User"},</p>

              <p>Your gift request has been approved.</p>

              <p>Your activation code:</p>

              <div style="
                font-size: 32px;
                font-weight: bold;
                padding: 12px;
                background: #f5f5f5;
                display: inline-block;
                border-radius: 8px;
              ">
                ${code}
              </div>

              <p style="margin-top:20px">
                Go to the activation page and enter this code.
              </p>
            </div>
          `,
        });

        console.log("EMAIL RESULT:", emailResult);
        console.log("EMAIL SENT TO:", profile.email);
      } catch (emailError) {
        console.error("EMAIL ERROR:", emailError);
      }
    }

    if (action === "reject") {
      const { error: rejectError } = await supabase
        .from("gift_applications")
        .update({
          status: "rejected",
        })
        .eq("id", applicationId);

      if (rejectError) {
        console.error("REJECT ERROR:", rejectError);

        return NextResponse.json(
          {
            success: false,
            error: rejectError.message,
          },
          { status: 500 }
        );
      }

      console.log("APPLICATION REJECTED");
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}