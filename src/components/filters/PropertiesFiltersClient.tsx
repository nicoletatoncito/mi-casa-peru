// src/components/filters/PropertiesFiltersClient.tsx
"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  // Para combos “reales” (opcional, pero se siente más pro)
  availableTypes: string[];
  availableDistricts: string[];
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export function PropertiesFiltersClient({ availableTypes, availableDistricts }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const initial = useMemo(() => {
    const get = (k: string) => sp.get(k) ?? "";
    return {
      q: get("q"),
      operation: get("operation"),
      type: get("type"),
      district: get("district"),
      minPrice: get("minPrice"),
      maxPrice: get("maxPrice"),
      beds: get("beds"),
      baths: get("baths"),
      sort: get("sort") || "newest",
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [q, setQ] = useState(initial.q);
  const [operation, setOperation] = useState(initial.operation);
  const [type, setType] = useState(initial.type);
  const [district, setDistrict] = useState(initial.district);
  const [minPrice, setMinPrice] = useState(initial.minPrice);
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice);
  const [beds, setBeds] = useState(initial.beds);
  const [baths, setBaths] = useState(initial.baths);
  const [sort, setSort] = useState(initial.sort);

  function apply() {
    const params = new URLSearchParams(sp.toString());

    const setOrDelete = (key: string, value: string) => {
      const v = value.trim();
      if (!v) params.delete(key);
      else params.set(key, v);
    };

    setOrDelete("q", q);
    setOrDelete("operation", operation);
    setOrDelete("type", type);
    setOrDelete("district", district);
    setOrDelete("minPrice", minPrice);
    setOrDelete("maxPrice", maxPrice);
    setOrDelete("beds", beds);
    setOrDelete("baths", baths);

    if (!sort || sort === "newest") params.delete("sort");
    else params.set("sort", sort);

    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-900">Filtros</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearAll}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={apply}
            className="rounded-xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800"
          >
            Aplicar
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") apply();
          }}
          placeholder="Buscar por distrito, dirección o título"
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-400"
        />

        <div className="grid grid-cols-2 gap-2">
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className={cn(
              "w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
            )}
          >
            <option value="">Operación (todas)</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
          >
            <option value="newest">Más recientes</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
          >
            <option value="">Distrito (todos)</option>
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
          >
            <option value="">Tipo (todos)</option>
            {availableTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="Precio mín (PEN)"
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-400"
            inputMode="numeric"
          />
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="Precio máx (PEN)"
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-400"
            inputMode="numeric"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
          >
            <option value="">Dorm. (cualquiera)</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>

          <select
            value={baths}
            onChange={(e) => setBaths(e.target.value)}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
          >
            <option value="">Baños (cualquiera)</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
          </select>
        </div>

        <p className="text-xs text-neutral-500">
          Los filtros se aplican en el servidor (URL compartible + SEO).
        </p>
      </div>
    </div>
  );
}