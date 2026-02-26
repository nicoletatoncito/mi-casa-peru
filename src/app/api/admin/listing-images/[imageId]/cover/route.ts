import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { createServerSupabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

function publicUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${path}`;
}

export async function POST(
  _: Request,
  ctx: { params: Promise<{ imageId: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return NextResponse.json({ ok: false }, { status: auth.status });

  const { imageId } = await ctx.params;
  const supabase = createServerSupabaseAdmin();

  const { data } = await supabase
    .from("listing_images")
    .select("*")
    .eq("id", imageId)
    .single();

  if (!data) return NextResponse.json({ ok: false });

  // reset covers
  await supabase
    .from("listing_images")
    .update({ is_cover: false })
    .eq("listing_id", data.listing_id);

  // set cover
  await supabase
    .from("listing_images")
    .update({ is_cover: true })
    .eq("id", imageId);

  // sync listing.image_url
  await supabase
    .from("listings")
    .update({ image_url: publicUrl(data.path) })
    .eq("id", data.listing_id);

  revalidatePath(`/propiedades/${data.listing_id}`);

  return NextResponse.json({ ok: true });
}