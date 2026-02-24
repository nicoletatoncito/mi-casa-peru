import Link from "next/link";
import { Card } from "@/components/ui/card";
import PeruMapSection from "@/components/maps/PeruMapSection";
import { fetchAllProperties, type Property } from "@/lib/db/properties";

function formatPEN(value: number) {
  return value.toLocaleString("es-PE");
}

function toMapItem(p: Property) {
  return {
    id: p.id,
    title: p.title,
    city: p.city,
    district: p.district,
    address: p.address,
    pricePen: p.price_pen,
    operation: p.operation,
    type: p.type,
    // Si no tienes coords reales, pon fallback a “centros” de ciudad
    lat:
      typeof p.lat === "number"
        ? p.lat
        : p.city?.toLowerCase().includes("lima")
        ? -12.0464
        : p.city?.toLowerCase().includes("arequipa")
        ? -16.409
        : -9.19,
    lng:
      typeof p.lng === "number"
        ? p.lng
        : p.city?.toLowerCase().includes("lima")
        ? -77.0428
        : p.city?.toLowerCase().includes("arequipa")
        ? -71.5375
        : -75.02,
  };
}

export default async function PropertiesPage() {
  const all = await fetchAllProperties();
  const items = all.map(toMapItem);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-14 pt-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Propiedades</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Explora el mapa y luego filtra. (Recomendado: guardar lat/lng reales en
          Supabase)
        </p>
      </div>

      {/* 1 SOLO MAPA */}
      <PeruMapSection items={items} height={520} />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {all.map((p) => (
          <Card
            key={p.id}
            className="rounded-3xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-zinc-500">
                  {p.operation} • {p.type}
                </div>
                <div className="mt-1 text-base font-semibold">{p.title}</div>
                <div className="mt-1 text-sm text-zinc-600">
                  {p.district}, {p.city}
                </div>
                <div className="mt-2 text-lg font-bold">
                  S/ {formatPEN(p.price_pen)}
                </div>
              </div>

              <Link
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                href={`/propiedades/${p.id}`}
              >
                Ver detalle
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}