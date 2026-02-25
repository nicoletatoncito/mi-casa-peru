// src/components/filters/PropertiesFiltersClient.tsx
"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  availableTypes: string[];
  availableDistricts: string[];
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function get(sp: URLSearchParams, key: string) {
  return sp.get(key) ?? "";
}

function buildUrl(pathname: string, sp: URLSearchParams, next: Record<string, string>) {
  const params = new URLSearchParams(sp.toString());

  const setOrDelete = (key: string, value: string) => {
    const v = value.trim();
    if (!v) params.delete(key);
    else params.set(key, v);
  };

  setOrDelete("q", next.q);
  setOrDelete("operation", next.operation);
  setOrDelete("type", next.type);
  setOrDelete("district", next.district);
  setOrDelete("minPrice", next.minPrice);
  setOrDelete("maxPrice", next.maxPrice);
  setOrDelete("beds", next.beds);
  setOrDelete("baths", next.baths);

  if (!next.sort || next.sort === "newest") params.delete("sort");
  else params.set("sort", next.sort);

  // ✅ cambios de filtros vuelven a página 1
  params.delete("page");

  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function PropertiesFiltersClient({ availableTypes, availableDistricts }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const debounceRef = useRef<number | null>(null);
  const didMountRef = useRef(false);

  const initial = useMemo(() => {
    const s = sp as unknown as URLSearchParams;
    return {
      q: get(s, "q"),
      operation: get(s, "operation"),
      type: get(s, "type"),
      district: get(s, "district"),
      minPrice: get(s, "minPrice"),
      maxPrice: get(s, "maxPrice"),
      beds: get(s, "beds"),
      baths: get(s, "baths"),
      sort: get(s, "sort") || "newest",
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

  // ✅ Sync inputs cuando la URL cambia (back/forward, links, paginación)
  useEffect(() => {
    const s = sp as unknown as URLSearchParams;

    const next = {
      q: get(s, "q"),
      operation: get(s, "operation"),
      type: get(s, "type"),
      district: get(s, "district"),
      minPrice: get(s, "minPrice"),
      maxPrice: get(s, "maxPrice"),
      beds: get(s, "beds"),
      baths: get(s, "baths"),
      sort: get(s, "sort") || "newest",
    };

    setQ(next.q);
    setOperation(next.operation);
    setType(next.type);
    setDistrict(next.district);
    setMinPrice(next.minPrice);
    setMaxPrice(next.maxPrice);
    setBeds(next.beds);
    setBaths(next.baths);
    setSort(next.sort);
  }, [sp]);

  function pushNow(nextState: {
    q: string;
    operation: string;
    type: string;
    district: string;
    minPrice: string;
    maxPrice: string;
    beds: string;
    baths: string;
    sort: string;
  }) {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    const s = sp as unknown as URLSearchParams;
    const url = buildUrl(pathname, s, nextState);

    const currentQs = s.toString();
    const currentUrl = currentQs ? `${pathname}?${currentQs}` : pathname;

    if (url === currentUrl) return;

    startTransition(() => {
      router.push(url, { scroll: false });
    });
  }

  function schedulePushForSearch() {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(() => {
      pushNow({
        q,
        operation,
        type,
        district,
        minPrice,
        maxPrice,
        beds,
        baths,
        sort,
      });
    }, 450);
  }

  // ✅ Auto-apply inmediato en selects / números (pero no en mount inicial)
  useEffect(() => {
    if (!didMountRef.current) return;
    pushNow({
      q,
      operation,
      type,
      district,
      minPrice,
      maxPrice,
      beds,
      baths,
      sort,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation, type, district, minPrice, maxPrice, beds, baths, sort]);

  // ✅ Auto-apply con debounce en búsqueda
  useEffect(() => {
    if (!didMountRef.current) return;
    schedulePushForSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // ✅ Marcar mount al final (evita push inmediato apenas carga)
  useEffect(() => {
    didMountRef.current = true;
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  function clearAll() {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }

  function apply() {
    // ✅ BOTÓN APLICAR: fuerza push inmediato (aunque debounce esté pendiente)
    pushNow({
      q,
      operation,
      type,
      district,
      minPrice,
      maxPrice,
      beds,
      baths,
      sort,
    });
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-900">Filtros</p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearAll}
            disabled={isPending}
            className={cn(
              "rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm",
              isPending ? "cursor-not-allowed text-neutral-400" : "text-neutral-900 hover:bg-neutral-50"
            )}
          >
            Limpiar
          </button>

          <button
            type="button"
            onClick={apply}
            disabled={isPending}
            className={cn(
              "rounded-xl px-3 py-2 text-xs font-semibold shadow-sm",
              isPending
                ? "cursor-not-allowed bg-neutral-800 text-white/80"
                : "bg-neutral-900 text-white hover:bg-neutral-800"
            )}
          >
            {isPending ? "Actualizando…" : "Aplicar"}
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
          disabled={isPending}
          placeholder="Buscar por distrito, dirección o título"
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-400 disabled:bg-neutral-50"
        />

        <div className="grid grid-cols-2 gap-2">
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            disabled={isPending}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-400 disabled:bg-neutral-50"
          >
            <option value="">Operación (todas)</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            disabled={isPending}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-400 disabled:bg-neutral-50"
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
            disabled={isPending}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-400 disabled:bg-neutral-50"
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
            disabled={isPending}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-400 disabled:bg-neutral-50"
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
            disabled={isPending}
            placeholder="Precio mín (PEN)"
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-400 disabled:bg-neutral-50"
            inputMode="numeric"
          />
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value.replace(/[^\d]/g, ""))}
            disabled={isPending}
            placeholder="Precio máx (PEN)"
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-400 disabled:bg-neutral-50"
            inputMode="numeric"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
            disabled={isPending}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-400 disabled:bg-neutral-50"
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
            disabled={isPending}
            className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-400 disabled:bg-neutral-50"
          >
            <option value="">Baños (cualquiera)</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
          </select>
        </div>

        <p className="text-xs text-neutral-500">
          {isPending ? "Actualizando resultados…" : "Los filtros se aplican en el servidor (URL compartible + SEO)."}
        </p>
      </div>
    </div>
  );
}