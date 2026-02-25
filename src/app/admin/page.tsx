// src/app/admin/page.tsx
import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";
import { adminListListings } from "@/lib/db/adminListings";

function formatPEN(value?: number | null) {
  if (!value) return "—";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AdminPage() {
  await requireAdminSession();

  const items = await adminListListings();

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">Admin</h1>
              <p className="mt-1 text-sm text-neutral-600">
                Gestión de publicaciones (crear / editar / eliminar / publicar).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
              >
                Ver web
              </Link>

              <Link
                href="/admin/new"
                className="rounded-xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800"
              >
                + Nueva propiedad
              </Link>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
            <p className="text-sm font-semibold text-neutral-900">
              Publicaciones ({items.length})
            </p>
            <p className="text-xs text-neutral-500">
              Tip: “draft” no aparece en la web pública.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="p-6 text-sm text-neutral-600">
              No hay publicaciones. Crea la primera con “Nueva propiedad”.
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {items.map((p) => (
                <div key={p.id} className="px-5 py-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-neutral-900">
                          {p.title}
                        </p>
                        <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-semibold text-neutral-700">
                          {p.status}
                        </span>
                        {p.featured ? (
                          <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-semibold text-neutral-700">
                            destacado
                          </span>
                        ) : null}
                        {p.verified ? (
                          <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-semibold text-neutral-700">
                            verificado
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-1 text-xs text-neutral-600">
                        {p.operation} • {p.property_type} •{" "}
                        {[p.district, p.city].filter(Boolean).join(", ") || "Perú"}
                      </p>

                      <p className="mt-2 text-xs text-neutral-500">
                        {formatPEN(p.price_pen)} • {p.created_at?.slice(0, 10)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/propiedades/${p.id}`}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
                      >
                        Ver
                      </Link>

                      <Link
                        href={`/admin/${p.id}`}
                        className="rounded-xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800"
                      >
                        Editar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}