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
    <main className="min-h-screen bg-neutral-50">
      <div className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-5">
          {/* Header / Breadcrumb */}
          <section className="rounded-3xl border border-neutral-200 bg-white shadow-sm">
            <div className="px-6 py-5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-neutral-600">
                <Link
                  href="/admin"
                  className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 hover:bg-neutral-50"
                >
                  Admin
                </Link>
                <span className="text-neutral-400">/</span>
                <Link
                  href="/admin/listings"
                  className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 hover:bg-neutral-50"
                >
                  Listings
                </Link>
                <span className="text-neutral-400">/</span>
                <span className="rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-white">
                  Editar
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl font-semibold text-neutral-900">Editar propiedad</h1>
                  <p className="mt-1 text-sm text-neutral-600">
                    Actualiza datos, portada y estado. La vista previa te muestra el resultado.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/propiedades/${id}`}
                    className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
                  >
                    Ver público
                  </Link>

                  <Link
                    href="/admin/listings"
                    className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
                  >
                    Volver a listings
                  </Link>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-xs font-semibold text-neutral-900">Tip rápido</p>
                <p className="mt-1 text-xs text-neutral-700">
                  Si vas a publicar, revisa: <span className="font-semibold">título</span>,{" "}
                  <span className="font-semibold">lat/lng</span> y una{" "}
                  <span className="font-semibold">portada</span> atractiva. Luego usa “Publicar”.
                </p>
              </div>
            </div>
          </section>

          {/* Form */}
          <section className="pb-2">
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
          </section>
        </div>
      </div>
    </main>
  );
}