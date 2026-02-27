import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { imageId: string } }
) {
  try {
    const { imageId } = params;

    // ✅ Aquí va tu lógica real (lo que ya tenías):
    // - validar admin session
    // - marcar esta imagen como cover
    // - actualizar DB / storage / etc.

    return NextResponse.json({ ok: true, imageId });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error desconocido en cover route";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}