// src/components/hero/HomeHeroSearch.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export function HomeHeroSearch() {
  const router = useRouter();
  const [operation, setOperation] = useState<"" | "venta" | "alquiler">("");
  const [q, setQ] = useState("");

  const placeholder = useMemo(
    () => "Distrito, dirección o tipo (ej. Miraflores, departamento)",
    []
  );

  function go() {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (operation) params.set("operation", operation);
    router.push(`/propiedades${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOperation("")}
            className={cn(
              "rounded-2xl px-3 py-2 text-sm font-semibold",
              operation === ""
                ? "bg-neutral-900 text-white"
                : "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
            )}
          >
            Todo
          </button>
          <button
            type="button"
            onClick={() => setOperation("venta")}
            className={cn(
              "rounded-2xl px-3 py-2 text-sm font-semibold",
              operation === "venta"
                ? "bg-neutral-900 text-white"
                : "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
            )}
          >
            Venta
          </button>
          <button
            type="button"
            onClick={() => setOperation("alquiler")}
            className={cn(
              "rounded-2xl px-3 py-2 text-sm font-semibold",
              operation === "alquiler"
                ? "bg-neutral-900 text-white"
                : "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
            )}
          >
            Alquiler
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") go();
            }}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-400"
          />
          <button
            type="button"
            onClick={go}
            className="rounded-2xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800"
          >
            Buscar
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs text-neutral-500">
        Consejo: escribe un distrito o tipo y luego ajusta filtros en el listado.
      </p>
    </div>
  );
}