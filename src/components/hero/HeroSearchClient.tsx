// src/components/hero/HeroSearchClient.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export function HeroSearchClient() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const placeholder = useMemo(
    () => "Busca distrito, provincia o tipo (ej: Miraflores, departamento)",
    []
  );

  return (
    <div className="rounded-3xl border bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="text-sm font-semibold text-neutral-900">
            Encuentra tu próxima propiedad
          </p>
          <p className="mt-1 text-xs text-neutral-600">
            Home sin mapa (evitamos duplicación). El mapa vive en /propiedades.
          </p>
        </div>

        <form
          className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            const query = q.trim();
            router.push(query ? `/propiedades?q=${encodeURIComponent(query)}` : "/propiedades");
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-2xl border bg-white px-4 py-2.5 text-sm outline-none ring-0 transition focus:border-neutral-400 sm:w-[420px]"
          />
          <button
            type="submit"
            className="rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
          >
            Buscar
          </button>
        </form>
      </div>
    </div>
  );
}