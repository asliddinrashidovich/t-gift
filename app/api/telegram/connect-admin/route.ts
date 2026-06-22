import { supabase } from "@/lib/supabase/client";

export async function POST() {
  try {
    const { data: settings } = await supabase
      .from("telegram_settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!settings?.bot_token) {
      return Response.json(
        { error: "Bot token not found" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.telegram.org/bot${settings.bot_token}/getUpdates`
    );

    const telegramData = await response.json();

    const lastMessage =
      telegramData.result?.[telegramData.result.length - 1];

    const chatId = lastMessage?.message?.chat?.id;

    if (!chatId) {
      return Response.json(
        {
          error:
            "No /start message found. Open bot and send /start first.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("telegram_settings")
      .update({
        admin_chat_id: String(chatId),
      })
      .eq("id", settings.id);

    if (error) throw error;

    return Response.json({
      success: true,
      chatId,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}