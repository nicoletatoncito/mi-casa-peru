"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

function cx(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shellClass = useMemo(() => {
    if (isHome) {
      return scrolled
        ? "bg-white/95 border-neutral-200 shadow-sm backdrop-blur"
        : "bg-white/80 border-white/30 backdrop-blur";
    }
    return "bg-white/95 border-neutral-200 shadow-sm backdrop-blur";
  }, [isHome, scrolled]);

  return (
    <header
      className={cx(
        "fixed top-0 z-50 w-full border-b transition",
        shellClass
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          
          {/* ✅ Logo SIN fondo negro */}
          <Image
            src="/logo-micasa-peru.svg"
            alt="Mi Casa Perú"
            width={42}
            height={42}
            priority
            className="object-contain"
          />

          <div className="leading-tight">
            <p className="text-[15px] font-semibold tracking-tight text-neutral-900">
              Mi Casa <span className="text-orange-500">Perú</span>
            </p>
            <p className="text-[11px] font-medium text-neutral-500">
              Portal inmobiliario
            </p>
          </div>
        </Link>

        {/* NAV */}
        <nav className="hidden items-center gap-8 text-sm font-semibold text-neutral-800 md:flex">
          <Link
            className="hover:text-neutral-900 transition"
            href="/propiedades?operation=venta"
          >
            Comprar
          </Link>
          <Link
            className="hover:text-neutral-900 transition"
            href="/propiedades?operation=alquiler"
          >
            Alquilar
          </Link>
          <Link
            className="hover:text-neutral-900 transition"
            href="/propiedades"
          >
            Explorar
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-2xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 transition"
          >
            Ingresar
          </Link>

          <Link
            href="/publica-tu-propiedad"
            className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition"
          >
            Publicar
          </Link>
        </div>
      </div>
    </header>
  );
}