// src/components/admin/ListingFormClient.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ListingStatus = "published" | "draft" | "archived";
type Operation = "venta" | "alquiler";

export type AdminListingForm = {
  title: string;
  description: string;
  price_pen: string;
  operation: Operation;
  property_type: string;
  beds: string;
  baths: string;
  parking: string;
  area_m2: string;
  city: string;
  district: string;
  address: string;
  lat: string;
  lng: string;
  image_url: string;
  featured: boolean;
  verified: boolean;
  status: ListingStatus;
};

const empty: AdminListingForm = {
  title: "",
  description: "",
  price_pen: "",
  operation: "venta",
  property_type: "Departamento",
  beds: "",
  baths: "",
  parking: "",
  area_m2: "",
  city: "Lima",
  district: "",
  address: "",
  lat: "",
  lng: "",
  image_url: "",
  featured: false,
  verified: false,
  status: "draft",
};

function toPayload(f: AdminListingForm) {
  const numOrNull = (v: string) => (v.trim() ? Number(v) : null);

  return {
    title: f.title,
    description: f.description.trim() ? f.description : null,
    price_pen: numOrNull(f.price_pen),
    operation: f.operation,
    property_type: f.property_type,
    beds: numOrNull(f.beds),
    baths: numOrNull(f.baths),
    parking: numOrNull(f.parking),
    area_m2: numOrNull(f.area_m2),
    city: f.city,
    district: f.district.trim() ? f.district : null,
    address: f.address.trim() ? f.address : null,
    lat: Number(f.lat),
    lng: Number(f.lng),
    image_url: f.image_url.trim() ? f.image_url : null,
    featured: f.featured,
    verified: f.verified,
    status: f.status,
  };
}

export function ListingFormClient({
  mode,
  id,
  initial,
}: {
  mode: "create" | "edit";
  id?: string;
  initial?: Partial<AdminListingForm>;
}) {
  const router = useRouter();
  const start = useMemo(() => ({ ...empty, ...(initial ?? {}) }), [initial]);
  const [form, setForm] = useState<AdminListingForm>(start);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof AdminListingForm>(k: K, v: AdminListingForm[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = toPayload(form);

      const url =
        mode === "create"
          ? "/api/admin/listings"
          : `/api/admin/listings/${id}`;

      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        setError(json?.error ?? "Error guardando");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!id) return;
    if (!confirm("¿Eliminar esta propiedad?")) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        setError(json?.error ?? "Error eliminando");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-neutral-700">Título</label>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700">Operación</label>
          <select
            value={form.operation}
            onChange={(e) => set("operation", e.target.value as any)}
            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
          >
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700">Estado</label>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value as any)}
            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
          >
            <option value="draft">draft (oculto)</option>
            <option value="published">published (visible)</option>
            <option value="archived">archived</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700">Tipo</label>
          <input
            value={form.property_type}
            onChange={(e) => set("property_type", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700">Precio (PEN)</label>
          <input
            value={form.price_pen}
            onChange={(e) => set("price_pen", e.target.value.replace(/[^\d]/g, ""))}
            inputMode="numeric"
            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
            placeholder="Ej: 850000"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700">Ciudad</label>
          <input
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700">Distrito</label>
          <input
            value={form.district}
            onChange={(e) => set("district", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
            placeholder="Ej: Miraflores"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-neutral-700">Dirección</label>
          <input
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
            placeholder="Ej: Av. X 123"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700">Lat</label>
          <input
            value={form.lat}
            onChange={(e) => set("lat", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
            placeholder="-12.1212"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700">Lng</label>
          <input
            value={form.lng}
            onChange={(e) => set("lng", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
            placeholder="-77.0303"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-neutral-700">Imagen (URL)</label>
          <input
            value={form.image_url}
            onChange={(e) => set("image_url", e.target.value)}
            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700">Dormitorios</label>
          <input
            value={form.beds}
            onChange={(e) => set("beds", e.target.value.replace(/[^\d]/g, ""))}
            inputMode="numeric"
            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700">Baños</label>
          <input
            value={form.baths}
            onChange={(e) => set("baths", e.target.value.replace(/[^\d]/g, ""))}
            inputMode="numeric"
            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700">Estacionamientos</label>
          <input
            value={form.parking}
            onChange={(e) => set("parking", e.target.value.replace(/[^\d]/g, ""))}
            inputMode="numeric"
            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-700">Área (m²)</label>
          <input
            value={form.area_m2}
            onChange={(e) => set("area_m2", e.target.value.replace(/[^\d.]/g, ""))}
            inputMode="decimal"
            className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-neutral-700">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="mt-1 min-h-[120px] w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
        </div>

        <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            Destacado
          </label>

          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={form.verified}
              onChange={(e) => set("verified", e.target.checked)}
            />
            Verificado
          </label>
        </div>
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>

        <button
          type="button"
          onClick={() => {
            router.push("/admin");
            router.refresh();
          }}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
        >
          Cancelar
        </button>

        {mode === "edit" ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={loading}
            className="ml-auto rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 shadow-sm hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Eliminar
          </button>
        ) : null}
      </div>
    </form>
  );
}