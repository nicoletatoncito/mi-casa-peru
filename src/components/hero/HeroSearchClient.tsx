"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Op = "Venta" | "Alquiler" | "Anticresis";

export default function HeroSearchClient() {
  const router = useRouter();

  const [op, setOp] = useState<Op>("Venta");
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const tabs: Op[] = useMemo(() => ["Venta", "Alquiler", "Anticresis"], []);

  function goSearch() {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (city.trim()) params.set("city", city.trim());
    if (op) params.set("op", op);
    if (minPrice.trim()) params.set("minPrice", minPrice.trim());
    if (maxPrice.trim()) params.set("maxPrice", maxPrice.trim());

    router.push(`/propiedades?${params.toString()}`);
  }

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur">
        {tabs.map((t) => {
          const active = op === t;
          return (
            <button
              key={t}
              onClick={() => setOp(t)}
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                active
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-white/80 hover:text-white",
              ].join(" ")}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Search bar */}
      <div className="rounded-2xl border border-white/12 bg-white/8 p-3 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-5">
            <label className="mb-1 block text-xs font-medium text-white/70">
              ¿Qué buscas?
            </label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ej: departamento, casa, oficina…"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 outline-none ring-0 focus:border-white/25"
            />
          </div>

          <div className="md:col-span-3">
            <label className="mb-1 block text-xs font-medium text-white/70">
              Ciudad
            </label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Lima, Arequipa, Cusco…"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/25"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-white/70">
              Mín (S/)
            </label>
            <input
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              inputMode="numeric"
              placeholder="0"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/25"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-white/70">
              Máx (S/)
            </label>
            <input
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              inputMode="numeric"
              placeholder="600000"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/25"
            />
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-white/55">
            Tip: busca por distrito o dirección (ej. “Miraflores”, “Yanahuara”).
          </div>

          <div className="flex gap-2">
            <button
              onClick={goSearch}
              className="h-11 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 shadow-sm hover:bg-zinc-100"
            >
              Buscar
            </button>
            <button
              onClick={() => router.push("/publicar")}
              className="h-11 rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}