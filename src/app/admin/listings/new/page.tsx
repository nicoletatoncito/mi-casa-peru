// src/app/admin/listings/new/page.tsx
import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";
import { ListingFormClient } from "@/components/admin/ListingFormClient";

export default async function AdminNewListingPage() {
  await requireAdminSession();

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Top padding + container */}
      <div className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-5">
          {/* Breadcrumb + Header */}
          <section className="rounded-3xl border border-neutral-200 bg-white shadow-sm">
            <div className="px-6 py-5">
              {/* Breadcrumb */}
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
                  Nueva
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl font-semibold text-neutral-900">
                    Nueva propiedad
                  </h1>
                  <p className="mt-1 text-sm text-neutral-600">
                    Completa los datos y publica cuando esté listo. La vista previa
                    te ayuda a ver cómo quedará en la web.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/"
                    className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
                  >
                    Ver web
                  </Link>

                  <Link
                    href="/admin/listings"
                    className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
                  >
                    Volver a listings
                  </Link>
                </div>
              </div>

              {/* Tip box */}
              <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-xs font-semibold text-neutral-900">
                  Tip rápido
                </p>
                <p className="mt-1 text-xs text-neutral-700">
                  Para publicar: define un buen <span className="font-semibold">título</span>{" "}
                  y <span className="font-semibold">ubicación</span> (lat/lng). Una{" "}
                  <span className="font-semibold">portada</span> de buena calidad
                  aumenta conversiones.
                </p>
              </div>
            </div>
          </section>

          {/* Form (sin card envolvente extra) */}
          <section className="pb-2">
            <ListingFormClient mode="create" />
          </section>
        </div>
      </div>
    </main>
  );
}