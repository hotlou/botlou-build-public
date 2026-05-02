import { NextRequest, NextResponse } from "next/server";
import { applyCommand } from "../_lib/demo-state";

export const dynamic = "force-dynamic";

type TelegramUpdate = {
  message?: {
    chat?: { id?: number | string };
    from?: { username?: string; first_name?: string };
    text?: string;
  };
};

function authorized(request: NextRequest, chatId?: string) {
  const secret = process.env.DEMO_WEBHOOK_SECRET;
  const allowedChat = process.env.TELEGRAM_ALLOWED_CHAT_ID;
  const provided =
    request.nextUrl.searchParams.get("secret") ||
    request.headers.get("x-demo-secret");

  if (secret && provided !== secret) return false;
  if (allowedChat && chatId && allowedChat !== chatId) return false;
  return true;
}

async function replyToTelegram(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true
    })
  }).catch(() => undefined);
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/telegram",
    accepts: "Telegram update payloads or { text } JSON",
    commands: ["/brief", "/mission educational", "/agent critic", "/ship"]
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as TelegramUpdate & {
    text?: string;
    command?: string;
  };
  const chatId = body.message?.chat?.id
    ? String(body.message.chat.id)
    : undefined;

  if (!authorized(request, chatId)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const text = String(body.message?.text || body.command || body.text || "").trim();
  if (!text) {
    return NextResponse.json(
      { ok: false, error: "No Telegram text found" },
      { status: 400 }
    );
  }

  const user =
    body.message?.from?.username ||
    body.message?.from?.first_name ||
    "telegram";
  const state = applyCommand(text, `telegram:${user}`);
  const latest = state.events[0];

  if (chatId) {
    await replyToTelegram(
      chatId,
      `botlou received: ${text}\n\n${latest.agent}: ${latest.title}`
    );
  }

  return NextResponse.json({ ok: true, state });
}
