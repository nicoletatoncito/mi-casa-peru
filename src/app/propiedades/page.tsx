// src/app/propiedades/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { PeruMapSection } from "@/components/maps/PeruMapSection";
import { PropertiesFiltersClient } from "@/components/filters/PropertiesFiltersClient";
import { PaginationClient } from "@/components/pagination/PaginationClient";
import SafeImage from "@/components/ui/SafeImage";

import { getPropertiesPaged } from "@/lib/db/properties";

export const metadata: Metadata = {
  title: "Propiedades | Mi Casa Perú",
  description: "Explora propiedades en venta y alquiler en Perú.",
};

function formatPEN(value?: number | null) {
  if (typeof value !== "number") return "Precio a consultar";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
  }).format(value);
}

type SearchParams = { [key: string]: string | string[] | undefined };

function sp1(sp: SearchParams, key: string): string | undefined {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

function toNumber(v?: string): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function toPage(v?: string): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

function uniqSorted(arr: string[]) {
  return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b, "es"));
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const sp = searchParams ?? {};

  const operation = sp1(sp, "operation");
  const q = sp1(sp, "q");
  const type = sp1(sp, "type");
  const district = sp1(sp, "district");
  const sort = (sp1(sp, "sort") as any) ?? "newest";
  const page = toPage(sp1(sp, "page"));

  const minPrice = toNumber(sp1(sp, "minPrice"));
  const maxPrice = toNumber(sp1(sp, "maxPrice"));
  const beds = toNumber(sp1(sp, "beds"));
  const baths = toNumber(sp1(sp, "baths"));

  const pageSize = 24;

  // ✅ BLINDAJE total: jamás revienta la UI
  let items: any[] = [];
  let total = 0;
  let totalPages = 1;

  try {
    const result = await getPropertiesPaged({
      q: q?.trim() ? q.trim() : undefined,
      operation:
        operation === "venta" || operation === "alquiler"
          ? operation
          : undefined,
      type: type?.trim() ? type.trim() : undefined,
      district: district?.trim() ? district.trim() : undefined,
      minPrice,
      maxPrice,
      beds,
      baths,
      sort,
      page,
      pageSize,
    });

    items = result?.items ?? [];
    total = result?.total ?? 0;
    totalPages = result?.totalPages ?? 1;
  } catch (err) {
    console.error("Error loading properties:", err);
  }

  // ✅ Opciones reales (no demo): salen del catálogo (de esta página)
  const availableTypes = uniqSorted(
    items
      .map((p: any) => String(p?.property_type ?? "").trim())
      .filter(Boolean)
  );

  const availableDistricts = uniqSorted(
    items.map((p: any) => String(p?.district ?? "").trim()).filter(Boolean)
  );

  return (
    <main className="min-h-screen bg-neutral-50 pt-16">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">
              Propiedades
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              {total} resultados · Página {page} de {totalPages}
            </p>
          </div>

          <Link
            href="/publica-tu-propiedad"
            className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
          >
            Publicar
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT */}
          <section className="space-y-4 lg:col-span-7">
            <PropertiesFiltersClient
              availableTypes={availableTypes}
              availableDistricts={availableDistricts}
            />

            {items.length === 0 ? (
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-neutral-900">
                  Sin resultados
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  No hay propiedades publicadas o los filtros no devolvieron
                  coincidencias.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {items.map((p: any) => {
                    const subtitle = [p.district, p.city]
                      .filter(Boolean)
                      .join(", ");
                    const price =
                      p.operation === "alquiler"
                        ? `${formatPEN(p.price_pen)}/mes`
                        : formatPEN(p.price_pen);

                    const metaParts = [
                      p.property_type,
                      typeof p.beds === "number" ? `${p.beds} dorm.` : null,
                      typeof p.baths === "number" ? `${p.baths} baños` : null,
                      typeof p.area_m2 === "number" ? `${p.area_m2} m²` : null,
                    ].filter(Boolean);

                    return (
                      <Link
                        key={p.id}
                        href={`/propiedades/${p.id}`}
                        className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-md"
                      >
                        <div className="relative h-44 bg-neutral-100">
                          <SafeImage
                            src={p.image_url}
                            alt={p.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white drop-shadow">
                                {p.title}
                              </p>
                              <p className="mt-0.5 truncate text-xs text-white/90 drop-shadow">
                                {subtitle || "Perú"}
                              </p>
                            </div>
                            <p className="shrink-0 text-sm font-semibold text-white drop-shadow">
                              {price}
                            </p>
                          </div>
                        </div>

                        <div className="p-4">
                          <p className="text-xs text-neutral-600">
                            {metaParts.join(" • ")}
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs font-semibold text-neutral-900">
                              Ver detalle
                            </span>
                            <span className="text-neutral-300 group-hover:text-neutral-500">
                              →
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <PaginationClient
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  pageSize={pageSize}
                />
              </>
            )}
          </section>

          {/* RIGHT */}
          <aside className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
                <div className="border-b border-neutral-100 px-5 py-4">
                  <p className="text-sm font-semibold text-neutral-900">Mapa</p>
                  <p className="mt-1 text-xs text-neutral-600">
                    Un solo mapa (estilo portal pro).
                  </p>
                </div>

                <div className="h-[560px]">
                  <Suspense
                    fallback={<div className="h-full w-full bg-neutral-100" />}
                  >
                    {/* ✅ Compatibilidad máxima:
                        - si tu componente espera `items`, lo recibe
                        - si espera `listings`, también lo recibe
                        (React ignora props extra) */}
                    <PeruMapSection
                      items={items as any[]}
                      listings={items as any[]}
                    />
                  </Suspense>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}