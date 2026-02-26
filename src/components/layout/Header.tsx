// src/components/layout/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-neutral-900 text-xs font-bold text-white">
            MC
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-neutral-900">Mi Casa Perú</p>
            <p className="text-xs text-neutral-500">Inmobiliaria</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/propiedades"
            className="rounded-full px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Propiedades
          </Link>

          <Link
            href="/publica-tu-propiedad"
            className="rounded-full bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Publica tu propiedad
          </Link>

          <Link
            href="/admin"
            className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}