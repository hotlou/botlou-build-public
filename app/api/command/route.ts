import { NextRequest, NextResponse } from "next/server";
import { applyCommand } from "../_lib/demo-state";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const command = String(body.command || body.text || "").trim();
  const source = String(body.source || "site");

  if (!command) {
    return NextResponse.json(
      { ok: false, error: "Send { command: string }" },
      { status: 400 }
    );
  }

  const state = applyCommand(command, source);
  return NextResponse.json({ ok: true, state });
}
