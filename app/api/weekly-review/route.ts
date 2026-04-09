import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type Row = {
  program_week: number;
  values: Record<string, string>;
  updated_at?: string;
};

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) return null;
  return createClient(url, serviceRole, { auth: { persistSession: false } });
}

function cloudEnabled() {
  return process.env.NEXT_PUBLIC_WEEKLY_REVIEW_CLOUD === "true";
}

export async function GET(request: Request) {
  if (!cloudEnabled()) return NextResponse.json({ values: {} }, { status: 200 });
  const client = getServerClient();
  if (!client) return NextResponse.json({ values: {} }, { status: 200 });

  const { searchParams } = new URL(request.url);
  const wantsSummary = searchParams.get("summary") === "1";

  if (wantsSummary) {
    const { data, error } = await client
      .from("weekly_reviews")
      .select("program_week, values");
    if (error || !data) return NextResponse.json({ weeks: [] }, { status: 200 });

    const weeks = data
      .filter((row) => {
        const values = (row as { values?: Record<string, unknown> }).values;
        if (!values || typeof values !== "object") return false;
        return Object.values(values).some((v) => typeof v === "string" && v.trim().length > 0);
      })
      .map((row) => (row as { program_week: number }).program_week);

    return NextResponse.json({ weeks }, { status: 200 });
  }

  const week = parseInt(searchParams.get("week") ?? "", 10);
  if (Number.isNaN(week) || week < 1 || week > 52) {
    return NextResponse.json({ error: "invalid week" }, { status: 400 });
  }

  const { data, error } = await client
    .from("weekly_reviews")
    .select("program_week, values, updated_at")
    .eq("program_week", week)
    .maybeSingle<Row>();

  if (error || !data) return NextResponse.json({ values: {} }, { status: 200 });
  return NextResponse.json({ values: data.values ?? {} }, { status: 200 });
}

export async function POST(request: Request) {
  if (!cloudEnabled()) {
    return NextResponse.json({ error: "cloud disabled" }, { status: 400 });
  }

  const client = getServerClient();
  if (!client) {
    return NextResponse.json({ error: "server not configured" }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as
    | { programWeek?: unknown; values?: unknown; key?: unknown }
    | null;

  const week = typeof body?.programWeek === "number" ? body.programWeek : NaN;
  const key = typeof body?.key === "string" ? body.key.trim() : "";
  const serverKey = process.env.WEEKLY_WRITE_KEY ?? "";
  if (!key || !serverKey || key !== serverKey) {
    return NextResponse.json({ error: "invalid key" }, { status: 401 });
  }
  if (Number.isNaN(week) || week < 1 || week > 52) {
    return NextResponse.json({ error: "invalid week" }, { status: 400 });
  }
  const values = body?.values;
  if (!values || typeof values !== "object") {
    return NextResponse.json({ error: "invalid values" }, { status: 400 });
  }

  const row: Row = {
    program_week: week,
    values: values as Record<string, string>,
  };
  const { error } = await client
    .from("weekly_reviews")
    .upsert(row, { onConflict: "program_week" });

  if (error) {
    return NextResponse.json({ error: "save failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}
