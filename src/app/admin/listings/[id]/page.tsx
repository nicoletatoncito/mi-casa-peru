// src/app/admin/listings/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import { adminGetListingById } from "@/lib/db/adminListings";
import { ListingFormClient } from "@/components/admin/ListingFormClient";

type Operation = "venta" | "alquiler";
type Status = "draft" | "published" | "archived";

function coerceOperation(v: unknown): Operation {
  return v === "alquiler" ? "alquiler" : "venta";
}

function coerceStatus(v: unknown): Status {
  if (v === "published" || v === "archived") return v;
  return "draft";
}

export default async function AdminEditListingPage(props: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await props.params;

  const item = await adminGetListingById(id);
  if (!item) return notFound();

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">Editar propiedad</h1>
              <p className="mt-1 text-sm text-neutral-600">
                Actualiza datos y sube nuevas imágenes.
              </p>
            </div>

            <Link
              href="/admin/listings"
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
            >
              Volver
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <ListingFormClient
            mode="edit"
            id={id}
            initial={{
              title: item.title ?? "",
              description: item.description ?? "",
              price_pen: item.price_pen?.toString() ?? "",
              operation: coerceOperation(item.operation),
              property_type: item.property_type ?? "Departamento",
              beds: item.beds?.toString() ?? "",
              baths: item.baths?.toString() ?? "",
              parking: item.parking?.toString() ?? "",
              area_m2: item.area_m2?.toString() ?? "",
              city: item.city ?? "Lima",
              district: item.district ?? "",
              address: item.address ?? "",
              lat: item.lat === null || item.lat === undefined ? "" : String(item.lat),
              lng: item.lng === null || item.lng === undefined ? "" : String(item.lng),
              image_url: item.image_url ?? "",
              whatsapp_phone: item.whatsapp_phone ?? "",
              featured: !!item.featured,
              verified: !!item.verified,
              status: coerceStatus(item.status),
            }}
          />
        </div>
      </div>
    </main>
  );
}