"use client";

import dynamic from "next/dynamic";
import type { MapItem } from "./PeruMap";

const PeruMap = dynamic(() => import("./PeruMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] overflow-hidden rounded-3xl border bg-white shadow-[0_25px_60px_-35px_rgba(0,0,0,.45)]">
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-zinc-500">Cargando mapa…</div>
      </div>
    </div>
  ),
});

export default function PeruMapSection({
  items,
  height = 520,
}: {
  items: MapItem[];
  height?: number;
}) {
  return <PeruMap items={items} height={height} />;
}