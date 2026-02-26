// src/app/api/leads/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

function isNonEmpty(v: unknown) {
  return typeof v === "string" && v.trim().length > 0;
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let listing_id: string | null = null;
    let name: string | null = null;
    let phone: string | null = null;
    let message: string | null = null;

    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => null);
      listing_id = isNonEmpty(body?.listing_id) ? body.listing_id.trim() : null;
      name = isNonEmpty(body?.name) ? body.name.trim() : null;
      phone = isNonEmpty(body?.phone) ? body.phone.trim() : null;
      message = isNonEmpty(body?.message) ? body.message.trim() : null;
    } else {
      // form post
      const form = await req.formData();
      listing_id = isNonEmpty(form.get("listing_id")) ? String(form.get("listing_id")).trim() : null;
      name = isNonEmpty(form.get("name")) ? String(form.get("name")).trim() : null;
      phone = isNonEmpty(form.get("phone")) ? String(form.get("phone")).trim() : null;
      message = isNonEmpty(form.get("message")) ? String(form.get("message")).trim() : null;
    }

    if (!listing_id || !name) {
      // si viene de un form, redirige de vuelta con error simple
      if (!contentType.includes("application/json")) {
        return NextResponse.redirect(new URL(`/propiedades/${listing_id ?? ""}?lead=error`, req.url));
      }
      return NextResponse.json({ ok: false, error: "listing_id y name son requeridos" }, { status: 400 });
    }

    const supabase = createServerSupabase();

    const { error } = await supabase.from("leads").insert({
      listing_id,
      name,
      phone,
      message,
      source: "web",
    });

    if (error) {
      if (!contentType.includes("application/json")) {
        return NextResponse.redirect(new URL(`/propiedades/${listing_id}?lead=error`, req.url));
      }
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    // éxito: si fue form, vuelve al detalle con flag
    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(new URL(`/propiedades/${listing_id}?lead=ok`, req.url));
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Error" }, { status: 500 });
  }
}