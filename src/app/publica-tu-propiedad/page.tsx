import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Publica tu propiedad | Mi Casa Perú",
  description:
    "Publica tu propiedad en Mi Casa Perú y recibe leads calificados con un landing moderno y mapa interactivo.",
};

export default function PublicaTuPropiedadPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold tracking-[0.18em] text-neutral-500">
                MI CASA PERÚ
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                Publica tu propiedad con una landing que vende.
              </h1>
              <p className="mt-3 text-sm text-neutral-600 sm:text-base">
                Convierte tu anuncio en una experiencia completa: fotos grandes, mapa interactivo,
                contacto por WhatsApp y formulario de leads. Ideal para agentes, constructoras o
                proyectos inmobiliarios que quieren verse profesionales desde el día uno.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/login?redirect=/admin/listings"
                  className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800"
                >
                  Entrar al panel admin
                </Link>
                <Link
                  href="/propiedades"
                  className="rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
                >
                  Ver ejemplo en vivo
                </Link>
              </div>

              <dl className="mt-8 grid grid-cols-1 gap-4 text-xs text-neutral-600 sm:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <dt className="font-semibold text-neutral-900">Leads listos para llamar</dt>
                  <dd className="mt-1">
                    Formulario conectado a Supabase: nombre, teléfono y mensaje quedan guardados en
                    la tabla `leads`.
                  </dd>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <dt className="font-semibold text-neutral-900">WhatsApp por propiedad</dt>
                  <dd className="mt-1">
                    Cada anuncio puede tener su propio WhatsApp; si no lo configuras, usa un
                    número global por defecto.
                  </dd>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <dt className="font-semibold text-neutral-900">SEO + mapa</dt>
                  <dd className="mt-1">
                    Detalle de propiedad con metadata dinámica y mapa Leaflet centrado en cada
                    ubicación.
                  </dd>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <dt className="font-semibold text-neutral-900">Pensado como SaaS</dt>
                  <dd className="mt-1">
                    Arquitectura lista para multi-landing, panel admin y futuras integraciones de
                    pago o planes.
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-900/95 p-5 text-white shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-300">
                  Demo del anuncio
                </p>

                <div className="mt-3 space-y-3 rounded-2xl bg-neutral-950/40 p-4">
                  <div className="h-40 rounded-2xl bg-[radial-gradient(1200px_circle_at_10%_10%,rgba(148,163,184,0.45),transparent_40%),radial-gradient(900px_circle_at_90%_30%,rgba(248,250,252,0.28),transparent_40%),linear-gradient(to_bottom,rgba(15,23,42,0.9),rgba(15,23,42,0.95))]" />

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        Departamento en Miraflores con vista al mar
                      </p>
                      <p className="mt-0.5 text-[11px] text-neutral-300">
                        Miraflores, Lima • 3 dorm • 2 baños • 110 m²
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-emerald-300">
                      S/ 950,000
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-200">
                      DESTACADO
                    </span>
                    <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-200">
                      VERIFICADO
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-neutral-950 shadow-sm hover:bg-emerald-400">
                      Botón de WhatsApp
                    </button>
                    <button className="inline-flex items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-semibold text-neutral-50 shadow-sm hover:bg-neutral-800">
                      Formulario de contacto
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] text-neutral-400">
                    Todo esto ya está implementado en el código. Solo conecta tu proyecto de
                    Supabase y empieza a usarlo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
