// src/components/hero/HomeHeroSearch.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Mode = "alquilar" | "comprar" | "proyectos";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function HomeHeroSearch() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("alquilar");
  const [type, setType] = useState("Departamento");
  const [q, setQ] = useState("");

  const operation = useMemo(() => {
    if (mode === "comprar") return "venta";
    if (mode === "alquilar") return "alquiler";
    return "";
  }, [mode]);

  function go() {
    if (mode === "proyectos") {
      router.push("/proyectos");
      return;
    }

    const params = new URLSearchParams();
    if (operation) params.set("operation", operation);
    if (type) params.set("type", type);
    if (q.trim()) params.set("q", q.trim());

    const qs = params.toString();
    router.push(qs ? `/propiedades?${qs}` : "/propiedades");
  }

  const hint =
    q.trim().length > 0
      ? `Buscando: “${q.trim()}”`
      : "Ejemplos: Miraflores · San Isidro · 2 dormitorios · terraza";

  return (
    <section className="relative h-[520px] w-full overflow-hidden">
      {/* Fondo (mejor que <img> en Vercel) */}
      <Image
        src="https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2070&auto=format&fit=crop"
        alt="Interior moderno"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 pt-10 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-wide text-white/80">
          MI CASA PERÚ · Portal inmobiliario
        </p>

        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Encuentra tu próximo hogar con claridad
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
          Filtra por zona, precio y tipo. Fichas completas, mapa y contacto directo para decidir rápido.
        </p>

        {/* Caja blanca (compacta) */}
        <div className="mt-7 max-w-5xl rounded-[28px] border border-white/20 bg-white/92 shadow-xl backdrop-blur">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-neutral-200/70 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2 rounded-full bg-neutral-100 p-1">
              <button
                type="button"
                onClick={() => setMode("alquilar")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold",
                  mode === "alquilar" ? "bg-white shadow-sm" : "text-neutral-700 hover:text-neutral-900"
                )}
              >
                Alquilar
              </button>

              <button
                type="button"
                onClick={() => setMode("comprar")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold",
                  mode === "comprar" ? "bg-white shadow-sm" : "text-neutral-700 hover:text-neutral-900"
                )}
              >
                Comprar
              </button>

              <button
                type="button"
                onClick={() => setMode("proyectos")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold",
                  mode === "proyectos" ? "bg-white shadow-sm" : "text-neutral-700 hover:text-neutral-900"
                )}
              >
                Proyectos
              </button>
            </div>

            <span className="hidden rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700 sm:inline-flex">
              Búsqueda rápida
            </span>
          </div>

          {/* Form */}
          <div className="px-4 pb-5 pt-4 sm:px-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
              {/* Tipo */}
              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-neutral-700">
                  Tipo de propiedad
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
                >
                  <option>Departamento</option>
                  <option>Casa</option>
                  <option>Terreno</option>
                  <option>Oficina</option>
                  <option>Local comercial</option>
                </select>
              </div>

              {/* Ubicación */}
              <div className="md:col-span-6">
                <label className="block text-xs font-semibold text-neutral-700">
                  Ubicación o características
                </label>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") go();
                  }}
                  placeholder="Ingresa zona, distrito o características (ej: piscina, balcón)"
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-400"
                />
                <p className="mt-2 text-xs text-neutral-500">{hint}</p>
              </div>

              {/* Botón */}
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={go}
                  className="w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
                >
                  {mode === "proyectos" ? "Ver proyectos" : "Buscar"}
                </button>
              </div>
            </div>

            {/* Chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-semibold text-neutral-800">
                Verificados
              </span>
              <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-semibold text-neutral-800">
                Destacados
              </span>
              <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-semibold text-neutral-800">
                Contacto rápido
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}