import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServer } from "@/lib/supabase/server";
import { adminListListings } from "@/lib/db/adminListings";
import { ClientActions, ClientFilters } from "@/components/admin/AdminListingsClient";

function formatPEN(value?: number | null) {
  if (!value) return "—";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return value.slice(0, 10);
}

function statusStyles(status?: string | null) {
  const s = (status ?? "draft").toLowerCase();
  if (s === "published") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (s === "archived") return "border-neutral-200 bg-neutral-100 text-neutral-700";
  return "border-amber-200 bg-amber-50 text-amber-800";
}

function statusLabel(status?: string | null) {
  const s = (status ?? "draft").toLowerCase();
  if (s === "published") return "Publicado";
  if (s === "archived") return "Archivado";
  return "Borrador";
}

function cx(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

type Operation = "venta" | "alquiler";
type Status = "draft" | "published" | "archived";

function normalizeOp(v?: string): Operation | "all" {
  const s = String(v ?? "").toLowerCase().trim();
  if (s === "venta" || s === "alquiler") return s as Operation;
  return "all";
}

function normalizeStatus(v?: string): Status | "all" {
  const s = String(v ?? "").toLowerCase().trim();
  if (s === "draft" || s === "published" || s === "archived") return s as Status;
  return "all";
}

function countByStatus(items: any[]) {
  const c = { draft: 0, published: 0, archived: 0 };
  for (const it of items) {
    const s = String(it?.status ?? "draft").toLowerCase();
    if (s === "published") c.published++;
    else if (s === "archived") c.archived++;
    else c.draft++;
  }
  return c;
}

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams?: { q?: string; status?: string; op?: string };
}) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/listings");
  }

  const q = String(searchParams?.q ?? "").trim();
  const status = normalizeStatus(searchParams?.status);
  const op = normalizeOp(searchParams?.op);

  const items = await adminListListings();

  const filtered = items.filter((p: any) => {
    const s = String(p.status ?? "draft").toLowerCase();
    const o = String(p.operation ?? "").toLowerCase();
    const matchesStatus = status === "all" ? true : s === status;
    const matchesOp = op === "all" ? true : o === op;

    const haystack = [
      p.title ?? "",
      p.city ?? "",
      p.district ?? "",
      p.property_type ?? "",
      p.operation ?? "",
      p.id ?? "",
    ]
      .join(" ")
      .toLowerCase();

    const matchesQ = q ? haystack.includes(q.toLowerCase()) : true;

    return matchesStatus && matchesOp && matchesQ;
  });

  const counts = countByStatus(items);

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
                <span className="rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-white">
                  Listings
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-neutral-900">Listings</h1>
                  <p className="mt-1 text-sm text-neutral-600">
                    Gestiona publicaciones: crear, editar, publicar, archivar y duplicar.
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
                    href="/admin/listings/new"
                    className="rounded-2xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800"
                  >
                    + Nueva propiedad
                  </Link>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-xs font-semibold text-neutral-900">Borradores</p>
                  <p className="mt-1 text-2xl font-semibold text-neutral-900">{counts.draft}</p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-xs font-semibold text-neutral-900">Publicados</p>
                  <p className="mt-1 text-2xl font-semibold text-neutral-900">{counts.published}</p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-xs font-semibold text-neutral-900">Archivados</p>
                  <p className="mt-1 text-2xl font-semibold text-neutral-900">{counts.archived}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-xs font-semibold text-neutral-900">Tip</p>
                <p className="mt-1 text-xs text-neutral-700">
                  “Borrador” no aparece en la web pública. Publica cuando la portada y la ubicación estén completas.
                  Usa <span className="font-semibold">Acciones ▾</span> para publicar/archivar/duplicar en 2 clics.
                </p>
              </div>
            </div>
          </section>

          {/* Table / List */}
          <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-100 px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-neutral-900">
                  Publicaciones{" "}
                  <span className="text-neutral-500">
                    ({filtered.length}
                    {filtered.length !== items.length ? ` de ${items.length}` : ""})
                  </span>
                </p>

                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Borrador
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Publicado
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-neutral-400" />
                    Archivado
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <ClientFilters basePath="/admin/listings" q={q} status={status} op={op} />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="p-8">
                <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
                  <p className="text-sm font-semibold text-neutral-900">No hay resultados</p>
                  <p className="mt-1 text-sm text-neutral-600">Ajusta tu búsqueda o limpia filtros.</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href="/admin/listings/new"
                      className="inline-flex rounded-2xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
                    >
                      + Crear propiedad
                    </Link>
                    <Link
                      href="/admin/listings"
                      className="inline-flex rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50"
                    >
                      Limpiar filtros
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {filtered.map((p: any) => {
                  const location = [p.district, p.city].filter(Boolean).join(", ") || "Perú";

                  return (
                    <div key={p.id} className="px-6 py-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        {/* Left */}
                        <div className="flex min-w-0 gap-4">
                          {/* Thumbnail */}
                          <div className="h-16 w-24 shrink-0 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
                            {p.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={p.image_url}
                                alt={p.title ?? "listing"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-[11px] font-semibold text-neutral-500">
                                Sin foto
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate text-sm font-semibold text-neutral-900">{p.title}</p>

                              <span
                                className={cx(
                                  "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                                  statusStyles(p.status)
                                )}
                              >
                                {statusLabel(p.status)}
                              </span>

                              {p.featured ? (
                                <span className="rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-neutral-800">
                                  Destacado
                                </span>
                              ) : null}

                              {p.verified ? (
                                <span className="rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-neutral-800">
                                  Verificado
                                </span>
                              ) : null}
                            </div>

                            <p className="mt-1 text-xs text-neutral-600">
                              {p.operation} • {p.property_type} • {location}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                              <span className="font-semibold text-neutral-700">{formatPEN(p.price_pen)}</span>
                              <span>•</span>
                              <span>{formatDate(p.created_at)}</span>
                              <span>•</span>
                              <span className="truncate">ID: {p.id}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions (client) */}
                        <div className="flex flex-wrap items-center gap-2">
                          <ClientActions id={p.id} currentStatus={p.status} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}