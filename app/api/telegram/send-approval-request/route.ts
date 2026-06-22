import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { applicationId, userEmail, tariffName, reason } = body;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data: settings, error } = await supabase
      .from("telegram_settings")
      .select("*")
      .single();

    console.log("SETTINGS:", settings);
    console.log("ERROR:", error);

    const token = settings.bot_token;
    const chatId = settings.admin_chat_id;

    const text = `
🎁 New Gift Application

👤 User: ${userEmail}

📦 Tariff: ${tariffName}

📝 Reason:
${reason}
`;

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: "✅ Approve",
            callback_data: `approve:${applicationId}`,
          },
          {
            text: "❌ Reject",
            callback_data: `reject:${applicationId}`,
          },
        ],
      ],
    };

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          reply_markup: keyboard,
        }),
      },
    );

    const telegramResult = await response.json();

    return NextResponse.json(telegramResult);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}
