import { NextResponse } from "next/server";
import { getDemoState } from "../_lib/demo-state";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getDemoState());
}
