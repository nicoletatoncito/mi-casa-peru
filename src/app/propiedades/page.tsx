// src/app/propiedades/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { PeruMapSection } from "@/components/maps/PeruMapSection";
import { PropertiesFiltersClient } from "@/components/filters/PropertiesFiltersClient";
import { PaginationClient } from "@/components/pagination/PaginationClient";
import { SafeImage } from "@/components/ui/SafeImage";

import { getPropertiesPaged } from "@/lib/db/properties";
import type { Listing } from "@/lib/db/properties";

export const metadata: Metadata = {
  title: "Propiedades | Mi Casa Perú",
  description: "Listado de propiedades con mapa interactivo.",
};

export const dynamic = "force-dynamic";

function formatPEN(value?: number | null) {
  if (!value) return "Precio a consultar";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
  }).format(value);
}

function parseNumber(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function normalizeString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function Card({
  href,
  image,
  title,
  subtitle,
  price,
  meta,
  featured,
  verified,
}: {
  href: string;
  image?: string | null;
  title: string;
  subtitle: string;
  price: string;
  meta: string;
  featured?: boolean;
  verified?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-[1px] hover:shadow-md"
    >
      <div className="relative h-44 w-full bg-neutral-100">
        {image ? (
          <SafeImage
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(1200px_circle_at_10%_10%,rgba(15,23,42,0.18),transparent_40%),radial-gradient(900px_circle_at_90%_30%,rgba(99,102,241,0.18),transparent_40%),linear-gradient(to_bottom,rgba(0,0,0,0.04),rgba(0,0,0,0.02))]" />
        )}

        <div className="absolute left-3 top-3 flex items-center gap-2">
          {featured ? (
            <span className="inline-flex items-center rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
              DESTACADO
            </span>
          ) : null}
          {verified ? (
            <span className="inline-flex items-center rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
              VERIFICADO
            </span>
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-white drop-shadow-sm">
                {title}
              </h3>
              <p className="mt-0.5 line-clamp-1 text-xs text-white/90 drop-shadow-sm">
                {subtitle}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-white drop-shadow-sm">
                {price}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-neutral-600">{meta}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-900">Ver detalle</span>
          <span className="text-neutral-400 transition group-hover:translate-x-0.5">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

function MapShellFallback() {
  return (
    <div className="relative h-[420px] w-full lg:h-[calc(100vh-210px)]">
      <div className="absolute inset-0 animate-pulse bg-neutral-100" />
      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 text-xs text-neutral-700 backdrop-blur">
        <span className="h-2 w-2 animate-pulse rounded-full bg-neutral-400" />
        Cargando mapa…
      </div>
    </div>
  );
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const sp = searchParams;

  const q = normalizeString(sp.q);
  const operation =
    sp.operation === "venta" || sp.operation === "alquiler"
      ? (sp.operation as "venta" | "alquiler")
      : undefined;

  const type = normalizeString(sp.type);
  const district = normalizeString(sp.district);

  const minPrice = parseNumber(normalizeString(sp.minPrice));
  const maxPrice = parseNumber(normalizeString(sp.maxPrice));
  const beds = parseNumber(normalizeString(sp.beds));
  const baths = parseNumber(normalizeString(sp.baths));

  const sort =
    sp.sort === "price_asc" ||
    sp.sort === "price_desc" ||
    sp.sort === "relevance" ||
    sp.sort === "newest"
      ? (sp.sort as any)
      : "newest";

  const page = clampInt(parseNumber(normalizeString(sp.page)) ?? 1, 1, 100000);
  const pageSize = 12;

  // ✅ Importante: NO concatenamos district a q (mantiene filtros limpios)
  const res = await getPropertiesPaged({
    q,
    operation,
    type,
    minPrice,
    maxPrice,
    beds,
    baths,
    sort,
    page,
    pageSize,
  });

  const listings = res.items as Listing[];

  const isString = (v: unknown): v is string =>
    typeof v === "string" && v.trim().length > 0;

  const availableTypes = Array.from(
    new Set(listings.map((l) => l.property_type).filter(isString))
  ).sort();

  const availableDistricts = Array.from(
    new Set(listings.map((l) => l.district).filter(isString))
  ).sort();

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="relative overflow-hidden border-b bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_circle_at_20%_-10%,rgba(99,102,241,0.16),transparent_45%),radial-gradient(900px_circle_at_80%_0%,rgba(15,23,42,0.10),transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wide text-neutral-500">
                MI CASA PERÚ
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
                Propiedades
              </h1>
              <p className="mt-1 text-sm text-neutral-600">
                {res.total ? `${res.total} resultados` : "Busca y filtra, con URL compartible."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 shadow-sm">
                Página {res.page} / {Math.max(1, res.totalPages)}
              </span>
              <Link
                href="/"
                className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 shadow-sm hover:bg-neutral-50"
              >
                Inicio
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* LIST primero para percepción */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <div className="space-y-4">
              <PropertiesFiltersClient
                availableTypes={availableTypes}
                availableDistricts={availableDistricts}
              />

              <div className="space-y-3">
                {listings.length === 0 ? (
                  <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl bg-neutral-100 text-neutral-700">
                        🔎
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-neutral-900">
                          No hay propiedades que coincidan
                        </p>
                        <p className="mt-1 text-sm text-neutral-600">
                          Ajusta filtros (precio, distrito, tipo) o limpia la búsqueda para ver más opciones.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link
                            href="/propiedades"
                            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
                          >
                            Limpiar filtros
                          </Link>
                          <Link
                            href="/"
                            className="rounded-xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800"
                          >
                            Volver al inicio
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  listings.map((p) => {
                    const subtitle = [p.district, p.city].filter(Boolean).join(", ");
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
                      <Card
                        key={p.id}
                        href={`/propiedades/${p.id}`}
                        image={p.image_url}
                        title={p.title}
                        subtitle={subtitle || "Perú"}
                        price={price}
                        meta={metaParts.join(" • ")}
                        featured={!!p.featured}
                        verified={!!p.verified}
                      />
                    );
                  })
                )}
              </div>

              <PaginationClient
                page={res.page}
                totalPages={res.totalPages}
                total={res.total}
                pageSize={res.pageSize}
              />
            </div>
          </div>

          {/* MAP no bloquea */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="lg:sticky lg:top-4">
              <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_14px_45px_-24px_rgba(0,0,0,0.35)]">
                <Suspense fallback={<MapShellFallback />}>
                  <PeruMapSection listings={listings} />
                </Suspense>
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                Mostrando ubicaciones de esta página.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}