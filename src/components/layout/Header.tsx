import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-black text-white shadow-sm">
            🏠
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-zinc-900">Mi Casa Perú</div>
            <div className="text-xs text-zinc-500">Portal inmobiliario</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-zinc-700 md:flex">
          <Link className="hover:text-zinc-950" href="/propiedades">
            Propiedades
          </Link>
          <Link className="hover:text-zinc-950" href="/publicar">
            Publicar
          </Link>
          <Link className="hover:text-zinc-950" href="/asesores">
            Asesores
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/ingresar"
            className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-900"
          >
            Ingresar
          </Link>
        </div>
      </div>
    </header>
  );
}