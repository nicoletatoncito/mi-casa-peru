// src/app/api/admin/listing-images/[imageId]/cover/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import { adminSetCoverImage } from "@/lib/db/adminListingImages";

function revalidateListing(listingId: string) {
  revalidatePath("/admin/listings");
  revalidatePath(`/admin/listings/${listingId}`);
  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${listingId}`);
}

export async function POST(_: Request, ctx: { params: { imageId: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: auth.status });
  }

  const imageId = ctx.params.imageId;

  try {
    const { listing_id, cover_url } = await adminSetCoverImage(imageId);
    revalidateListing(listing_id);
    return NextResponse.json({ ok: true, listing_id, cover_url });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error setting cover";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}