// src/components/maps/PeruMapSection.tsx
"use client";

import { useMemo } from "react";
import { PeruMap } from "./PeruMap";

type Listing = {
  id: string;
  title: string;
  price_pen: number | null;
  operation: "venta" | "alquiler";
  city: string;
  district: string | null;
  address: string | null;
  lat: number;
  lng: number;
  featured: boolean;
  verified: boolean;
};

function formatPEN(value?: number | null) {
  if (!value) return "Precio a consultar";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PeruMapSection({ listings }: { listings: Listing[] }) {
  const pins = useMemo(() => {
    return (listings ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      lat: p.lat,
      lng: p.lng,
      priceLabel:
        p.operation === "alquiler"
          ? `${formatPEN(p.price_pen)}/mes`
          : formatPEN(p.price_pen),
      subtitle: [p.district, p.city].filter(Boolean).join(", ") || p.address || "Perú",
      href: `/propiedades/${p.id}`,
      featured: p.featured,
      verified: p.verified,
    }));
  }, [listings]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-[700] p-3">
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-neutral-200/70 bg-white/85 px-3 py-1.5 text-xs text-neutral-700 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Mapa
          <span className="text-neutral-300">•</span>
          <span className="font-semibold text-neutral-900">{pins.length}</span>
          <span className="text-neutral-500">ubicaciones</span>
        </div>
      </div>

      <PeruMap pins={pins} />
    </div>
  );
}