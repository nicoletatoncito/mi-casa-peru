// src/app/api/admin/listings/[id]/images/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import { createServerSupabaseAdmin } from "@/lib/supabase";

function getPublicUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  return `${base}/storage/v1/object/public/listing-images/${path}`;
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: auth.status }
    );
  }

  const { id: listingId } = await ctx.params;

  const form = await req.formData();
  const files = form.getAll("files") as File[];
  const setCover = String(form.get("setCover") ?? "true") === "true";

  if (!files || files.length === 0) {
    return NextResponse.json(
      { ok: false, error: "No files" },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseAdmin();
  const uploaded: string[] = [];

  for (const file of files) {
    if (!(file instanceof File)) continue;

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const filename = `${crypto.randomUUID()}.${ext}`;
    const path = `${listingId}/${filename}`;

    const arrayBuffer = await file.arrayBuffer();

    const { error: upErr } = await supabase.storage
      .from("listing-images")
      .upload(path, arrayBuffer, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (upErr) {
      return NextResponse.json(
        { ok: false, error: upErr.message },
        { status: 500 }
      );
    }

    uploaded.push(path);

    // Si tienes tabla listing_images, guarda
    await supabase.from("listing_images").insert({
      listing_id: listingId,
      path,
      is_cover: false,
      sort_order: 0,
    });
  }

  if (setCover && uploaded.length > 0) {
    const coverPath = uploaded[0];
    const coverUrl = getPublicUrl(coverPath);

    await supabase
      .from("listing_images")
      .update({ is_cover: false })
      .eq("listing_id", listingId);

    await supabase
      .from("listing_images")
      .update({ is_cover: true })
      .eq("listing_id", listingId)
      .eq("path", coverPath);

    await supabase
      .from("listings")
      .update({ image_url: coverUrl })
      .eq("id", listingId);
  }

  // ✅ Revalida rutas (en vez de tags)
  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${listingId}`);

  return NextResponse.json({ ok: true, paths: uploaded });
}