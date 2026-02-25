// src/app/admin/[id]/page.tsx
import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";
import { createServerSupabaseAdmin } from "@/lib/supabase";
import { ListingFormClient } from "@/components/admin/ListingFormClient";
import type { Listing } from "@/lib/db/properties";

const SELECT =
  "id,title,description,price_pen,operation,property_type,beds,baths,parking,area_m2,city,district,address,lat,lng,image_url,featured,verified,status,created_at";

export default async function AdminEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();

  const { id } = await params;

  const supabase = createServerSupabaseAdmin();
  const { data } = await supabase.from("listings").select(SELECT).eq("id", id).maybeSingle();

  const p = (data ?? null) as Listing | null;

  if (!p) {
    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-neutral-900">No encontrada</p>
          <Link href="/admin" className="mt-3 inline-block text-sm text-neutral-700 underline">
            Volver
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold text-neutral-900">
                Editar: {p.title}
              </h1>
              <p className="mt-1 text-sm text-neutral-600">
                Cambia campos, publica o elimina.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/propiedades/${p.id}`}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
              >
                Ver en web
              </Link>
              <Link
                href="/admin"
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
              >
                Volver
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <ListingFormClient
            mode="edit"
            id={p.id}
            initial={{
              title: p.title ?? "",
              description: p.description ?? "",
              price_pen: p.price_pen ? String(p.price_pen) : "",
              operation: p.operation,
              property_type: p.property_type ?? "",
              beds: typeof p.beds === "number" ? String(p.beds) : "",
              baths: typeof p.baths === "number" ? String(p.baths) : "",
              parking: typeof p.parking === "number" ? String(p.parking) : "",
              area_m2: typeof p.area_m2 === "number" ? String(p.area_m2) : "",
              city: p.city ?? "",
              district: p.district ?? "",
              address: p.address ?? "",
              lat: String(p.lat),
              lng: String(p.lng),
              image_url: p.image_url ?? "",
              featured: !!p.featured,
              verified: !!p.verified,
              status: p.status,
            }}
          />
        </div>
      </div>
    </main>
  );
}