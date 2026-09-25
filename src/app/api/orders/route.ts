import { NextResponse } from "next/server";

/**
 * Order intake stub. The customer is handed off to WhatsApp for confirmation;
 * this endpoint is where the order gets stored (Supabase/Prisma) once the
 * back-office exists. For now it validates and logs.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, items, totals } = body ?? {};
    if (!customer?.name || !customer?.phone || !Array.isArray(items) || !items.length) {
      return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
    }
    const ref = `WA-${Date.now().toString(36).toUpperCase()}`;
    console.log("[order]", ref, customer.name, customer.wilaya, items.length, "items", totals?.total, "DZD");
    // TODO: insert into orders table
    return NextResponse.json({ ok: true, ref });
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }
}
