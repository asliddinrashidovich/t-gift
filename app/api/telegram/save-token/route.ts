import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const { botToken } = await req.json();

    const { data, error } = await supabase
      .from("telegram_settings")
      .insert({
        bot_token: botToken,
      })
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return Response.json(error, { status: 500 });
    }

    return Response.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Route error:", error);

    return Response.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}