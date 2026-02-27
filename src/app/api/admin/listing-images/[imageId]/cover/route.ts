import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { imageId: string } }
) {
  try {
    const { imageId } = params;

    // tu lógica actual aquí...

    return NextResponse.json({ ok: true, imageId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}