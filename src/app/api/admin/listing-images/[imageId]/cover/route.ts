import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { adminSetCoverImage } from "@/lib/db/adminListingImages";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    await requireAdminSession();

    const { imageId } = await params;

    const result = await adminSetCoverImage(imageId, "listing-images");

    return NextResponse.json({
      ok: true,
      imageId,
      listing_id: result.listing_id,
      cover_url: result.cover_url,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}