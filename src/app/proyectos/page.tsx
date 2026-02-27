// src/app/proyectos/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ProyectosPage() {
  return (
    <main className="min-h-screen bg-neutral-50 pt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500">
            MI CASA PERÚ
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
            Proyectos inmobiliarios
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">
            Aquí mostraremos proyectos (edificios / preventa / lanzamientos).
            Por ahora puedes explorar el catálogo general.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/propiedades"
              className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Explorar propiedades
            </Link>
            <Link
              href="/propiedades?operation=venta"
              className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            >
              Ver compra
            </Link>
            <Link
              href="/propiedades?operation=alquiler"
              className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            >
              Ver alquiler
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}