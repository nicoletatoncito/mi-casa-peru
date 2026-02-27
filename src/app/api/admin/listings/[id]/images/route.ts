import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/auth";
import { createServerSupabaseAdmin } from "@/lib/supabase";
import {
  adminListListingImages,
  adminInsertListingImages,
  adminDeleteListingImage,
  adminReorderListingImages,
} from "@/lib/db/adminListingImages";

function revalidateListing(listingId: string) {
  revalidatePath("/admin/listings");
  revalidatePath(`/admin/listings/${listingId}`);
  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${listingId}`);
}

function safeExt(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "jpg";
  return ["jpg", "jpeg", "png", "webp", "avif"].includes(ext) ? ext : "jpg";
}

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: auth.status }
    );
  }

  const { id: listingId } = await params;

  try {
    const images = await adminListListingImages(listingId);
    return NextResponse.json({ ok: true, images });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error loading images";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: Ctx) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: auth.status }
    );
  }

  const { id: listingId } = await params;

  try {
    const form = await req.formData();
    const files = form.getAll("files") as File[];
    const setCover =
      String(form.get("setCover") ?? "false").toLowerCase() === "true";

    if (!files || files.length === 0) {
      return NextResponse.json({ ok: false, error: "No files" }, { status: 400 });
    }

    const supabase = createServerSupabaseAdmin();
    const bucket = "listing-images";

    const paths: string[] = [];

    for (const f of files) {
      if (!(f instanceof File)) continue;
      if (!f.type.startsWith("image/")) continue;

      const arrayBuffer = await f.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      const ext = safeExt(f.name);
      const fileName = `${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}.${ext}`;
      const path = `listings/${listingId}/${fileName}`;

      const { error: upErr } = await supabase.storage.from(bucket).upload(path, bytes, {
        cacheControl: "3600",
        upsert: false,
        contentType: f.type || undefined,
      });
      if (upErr) throw upErr;

      paths.push(path);
    }

    await adminInsertListingImages(listingId, paths, setCover);

    revalidateListing(listingId);

    return NextResponse.json({ ok: true, uploaded: paths.length });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error uploading images";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: auth.status }
    );
  }

  const { id: listingId } = await params;

  const url = new URL(req.url);
  const imageId = url.searchParams.get("imageId");

  if (!imageId) {
    return NextResponse.json(
      { ok: false, error: "Missing imageId" },
      { status: 400 }
    );
  }

  try {
    await adminDeleteListingImage(listingId, imageId);
    revalidateListing(listingId);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error deleting image";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  const auth = await requireAdminApi();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: auth.status }
    );
  }

  const { id: listingId } = await params;

  const body = await req.json().catch(() => null);
  const orderedIds = Array.isArray(body?.orderedIds)
    ? (body.orderedIds as string[])
    : [];

  if (orderedIds.length === 0) {
    return NextResponse.json(
      { ok: false, error: "orderedIds required" },
      { status: 400 }
    );
  }

  try {
    await adminReorderListingImages(listingId, orderedIds);
    revalidateListing(listingId);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error saving order";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}