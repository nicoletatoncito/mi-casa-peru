// src/lib/db/adminListingImages.ts
import "server-only";
import { createServerSupabaseAdmin } from "@/lib/supabase";

export type ListingImageRow = {
  id: string;
  listing_id: string;
  path: string;
  is_cover: boolean;
  sort_order: number;
  created_at: string;
};

const TABLE = "listing_images";

export async function adminListListingImages(listingId: string, bucket = "listing-images") {
  const supabase = createServerSupabaseAdmin();

  const { data, error } = await supabase
    .from(TABLE)
    .select("id,listing_id,path,is_cover,sort_order,created_at")
    .eq("listing_id", listingId)
    .order("is_cover", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  const rows = (data ?? []) as ListingImageRow[];
  const images = rows.map((r) => {
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(r.path);
    return { ...r, public_url: pub.publicUrl };
  });

  return images;
}

export async function adminInsertListingImages(
  listingId: string,
  paths: string[],
  setCoverIfEmpty: boolean
) {
  const supabase = createServerSupabaseAdmin();

  // calcula sort_order desde el max actual
  const { data: maxRow } = await supabase
    .from(TABLE)
    .select("sort_order")
    .eq("listing_id", listingId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const start = (maxRow?.sort_order ?? 0) + 1;

  const payload = paths.map((p, idx) => ({
    listing_id: listingId,
    path: p,
    is_cover: false,
    sort_order: start + idx,
  }));

  const { error: insErr } = await supabase.from(TABLE).insert(payload);
  if (insErr) throw insErr;

  if (setCoverIfEmpty) {
    // si no hay cover, marca el primero
    const { data: existingCover } = await supabase
      .from(TABLE)
      .select("id")
      .eq("listing_id", listingId)
      .eq("is_cover", true)
      .limit(1)
      .maybeSingle();

    if (!existingCover && paths.length > 0) {
      // marca el que tenga menor sort_order
      const { data: first } = await supabase
        .from(TABLE)
        .select("id")
        .eq("listing_id", listingId)
        .order("sort_order", { ascending: true })
        .limit(1)
        .single();

      if (first?.id) {
        await adminSetCoverImage(first.id, "listing-images");
      }
    }
  }
}

export async function adminSetCoverImage(imageId: string, bucket = "listing-images") {
  const supabase = createServerSupabaseAdmin();

  // 1) obtener row
  const { data: row, error: getErr } = await supabase
    .from(TABLE)
    .select("id,listing_id,path")
    .eq("id", imageId)
    .single();

  if (getErr) throw getErr;

  // 2) quitar cover anterior
  const { error: clearErr } = await supabase
    .from(TABLE)
    .update({ is_cover: false })
    .eq("listing_id", row.listing_id)
    .eq("is_cover", true);

  if (clearErr) throw clearErr;

  // 3) set cover
  const { error: setErr } = await supabase
    .from(TABLE)
    .update({ is_cover: true })
    .eq("id", imageId);

  if (setErr) throw setErr;

  // 4) sync listings.image_url para cards/SEO
  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(row.path);
  const coverUrl = pub.publicUrl;

  const { error: syncErr } = await supabase
    .from("listings")
    .update({ image_url: coverUrl })
    .eq("id", row.listing_id);

  if (syncErr) throw syncErr;

  return { listing_id: row.listing_id as string, cover_url: coverUrl };
}

export async function adminDeleteListingImage(listingId: string, imageId: string, bucket = "listing-images") {
  const supabase = createServerSupabaseAdmin();

  // get row
  const { data: row, error: getErr } = await supabase
    .from(TABLE)
    .select("id,path,is_cover")
    .eq("id", imageId)
    .eq("listing_id", listingId)
    .single();

  if (getErr) throw getErr;

  // delete db
  const { error: delErr } = await supabase.from(TABLE).delete().eq("id", imageId);
  if (delErr) throw delErr;

  // delete storage (no romper si falla)
  await supabase.storage.from(bucket).remove([row.path]).catch(() => null);

  // si era cover, elegir otro cover
  if (row.is_cover) {
    const { data: next } = await supabase
      .from(TABLE)
      .select("id")
      .eq("listing_id", listingId)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (next?.id) {
      await adminSetCoverImage(next.id, bucket);
    } else {
      // no quedan imágenes: limpiar image_url
      await supabase.from("listings").update({ image_url: null }).eq("id", listingId);
    }
  }
}

export async function adminReorderListingImages(listingId: string, orderedIds: string[]) {
  const supabase = createServerSupabaseAdmin();

  // update masivo (simple, robusto)
  const updates = orderedIds.map((id, idx) => ({ id, listing_id: listingId, sort_order: idx + 1 }));

  // upsert por id
  const { error } = await supabase
    .from(TABLE)
    .upsert(updates, { onConflict: "id" });

  if (error) throw error;
}