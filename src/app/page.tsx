// src/app/page.tsx
import Link from "next/link";
import { getProperties } from "@/lib/db/properties";
import { SafeImage } from "@/components/ui/SafeImage";

export const revalidate = 60;

function formatPEN(value?: number | null) {
  if (typeof value !== "number") return "Precio a consultar";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
  }).format(value);
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-semibold tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

export default async function HomePage() {
  // Server: trae data
  const listings = await getProperties({ sort: "newest" });

  const featured = listings.filter((l: any) => l.featured).slice(0, 3);
  const latest = listings.slice(0, 6);

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* HERO */}
      <section className="relative overflow-hidden border-b bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_circle_at_20%_-10%,rgba(99,102,241,0.14),transparent_45%),radial-gradient(900px_circle_at_80%_0%,rgba(15,23,42,0.08),transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            {/* LEFT */}
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold tracking-wide text-neutral-500">
                MI CASA PERÚ
              </p>

              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
                Propiedades en venta y alquiler,{" "}
                <span className="text-neutral-500">sin perder tiempo</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-600">
                Catálogo claro, fichas completas y un solo mapa en el listado.
                Experiencia premium pensada para decidir rápido.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/propiedades"
                  className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800"
                >
                  Ver propiedades
                </Link>

                <Link
                  href="/propiedades?sort=newest"
                  className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
                >
                  Ver lo más nuevo
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Stat label="Publicaciones" value={`${listings.length}+`} />
                <Stat label="Mapa" value="Único" />
                <Stat label="UI" value="Premium" />
              </div>
            </div>

            {/* RIGHT PANEL (editorial / destacados) */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      Selección destacada
                    </p>
                    <p className="mt-1 text-sm text-neutral-600">
                      Propiedades con mejor presentación y data completa.
                    </p>
                  </div>

                  <span className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
                    {listings.length} disponibles
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {(featured.length ? featured : latest.slice(0, 3)).map(
                    (p: any) => {
                      const subtitle = [p.district, p.city]
                        .filter(Boolean)
                        .join(", ");
                      const price =
                        p.operation === "alquiler"
                          ? `${formatPEN(p.price_pen)}/mes`
                          : formatPEN(p.price_pen);

                      return (
                        <Link
                          key={p.id}
                          href={`/propiedades/${p.id}`}
                          className="group flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 hover:bg-neutral-50"
                        >
                          <div className="h-12 w-12 overflow-hidden rounded-xl bg-neutral-100">
                            <SafeImage
                              src={p.image_url}
                              alt={p.title}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-neutral-900">
                              {p.title}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-neutral-600">
                              {subtitle || "Perú"}
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-xs font-semibold text-neutral-900">
                              {price}
                            </p>
                            <p className="mt-0.5 text-[11px] text-neutral-500">
                              {String(p.operation).toUpperCase()}
                            </p>
                          </div>

                          <span className="text-neutral-300 group-hover:text-neutral-500">
                            →
                          </span>
                        </Link>
                      );
                    }
                  )}
                </div>

                <div className="mt-4">
                  <Link
                    href="/propiedades"
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800"
                  >
                    Explorar listado + mapa
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÚLTIMAS PUBLICACIONES */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Últimas publicaciones
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Lo más reciente del catálogo (mapa solo en /propiedades).
            </p>
          </div>

          <Link
            href="/propiedades?sort=newest"
            className="text-sm font-semibold text-neutral-900 hover:text-neutral-700"
          >
            Ver todo →
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((p: any) => {
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
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white drop-shadow-sm">
                        {p.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-white/90 drop-shadow-sm">
                        {subtitle || "Perú"}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-white drop-shadow-sm">
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

        {latest.length === 0 && (
          <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-neutral-900">
              Aún no hay publicaciones
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Crea al menos una propiedad en Supabase con <code>status=published</code>.
            </p>
          </div>
        )}
      </section>

      {/* FOOTER minimal */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-xs text-neutral-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Mi Casa Perú.
        </div>
      </footer>
    </main>
  );
}