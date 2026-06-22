import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const update = await req.json();

    console.log("UPDATE:", update);

    if (!update.callback_query) {
      return NextResponse.json({ ok: true });
    }

    const callbackQuery = update.callback_query;
    const callbackData = callbackQuery.data;

    const [action, applicationId] = callbackData.split(":");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Loading spinnerni to'xtatish
    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          callback_query_id: callbackQuery.id,
        }),
      }
    );

    const { data: application, error: applicationError } = await supabase
      .from("gift_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (applicationError || !application) {
      console.error(applicationError);

      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", application.user_id)
      .single();

    const { data: tariff } = await supabase
      .from("tariffs")
      .select("name")
      .eq("id", application.tariff_id)
      .single();

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
        console.error(error);

        return NextResponse.json(
          { error: "Approve failed" },
          { status: 500 }
        );
      }

      // Email yuborish
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: profile?.email,
          subject: "Gift Application Approved 🎉",
          html: `
            <h2>Gift Application Approved 🎉</h2>
            <p>Your activation code:</p>
            <h1>${code}</h1>
          `,
        });

        console.log("EMAIL SENT");
      } catch (emailError) {
        console.error("EMAIL ERROR:", emailError);
      }

      // Telegramdagi eski message ni update qilish
      await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id,
            text: `✅ Gift Application Approved

👤 User: ${profile?.email}

📦 Tariff: ${tariff?.name}

🔑 Code: ${code}

🕒 ${new Date().toLocaleString()}
`,
          }),
        }
      );
    }

    if (action === "reject") {
      await supabase
        .from("gift_applications")
        .update({
          status: "rejected",
        })
        .eq("id", applicationId);

      await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id,
            text: `❌ Gift Application Rejected

👤 User: ${profile?.email}

📦 Tariff: ${tariff?.name}

🕒 ${new Date().toLocaleString()}
`,
          }),
        }
      );
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