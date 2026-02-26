import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { createServerSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function DELETE(
  _: Request,
  ctx: { params: Promise<{ imageId: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return NextResponse.json({ ok: false }, { status: auth.status });

  const { imageId } = await ctx.params;
  const supabase = createServerSupabaseAdmin();

  // obtener path + listing_id
  const { data, error } = await supabase
    .from("listing_images")
    .select("path, listing_id")
    .eq("id", imageId)
    .single();

  if (error || !data) {
    return NextResponse.json({ ok: false, error: "Image not found" }, { status: 404 });
  }

  // borrar de storage
  await supabase.storage.from("listing-images").remove([data.path]);

  // borrar DB
  await supabase.from("listing_images").delete().eq("id", imageId);

  revalidatePath(`/admin/listings/${data.listing_id}`);
  revalidatePath(`/propiedades/${data.listing_id}`);

  return NextResponse.json({ ok: true });
}