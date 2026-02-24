import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import PeruMapSection from "@/components/maps/PeruMapSection";
import { fetchPropertyById } from "@/lib/db/properties";

function formatPEN(value: number) {
  return value.toLocaleString("es-PE");
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const p = await fetchPropertyById(params.id);
  if (!p) return notFound();

  const mapItem = {
    id: p.id,
    title: p.title,
    city: p.city,
    district: p.district,
    address: p.address,
    pricePen: p.price_pen,
    operation: p.operation,
    type: p.type,
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

  return (
    <main className="mx-auto max-w-6xl px-4 pb-14 pt-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{p.title}</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {p.district}, {p.city} • {p.operation} • {p.type}
          </p>
        </div>

        <Link
          href="/propiedades"
          className="rounded-full border bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
        >
          Volver
        </Link>
      </div>

      {/* MAPA ÚNICO EN DETALLE */}
      <PeruMapSection items={[mapItem]} height={420} />

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="rounded-3xl border bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-base font-semibold">Descripción</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700">
            {p.description || "Sin descripción por ahora."}
          </p>
        </Card>

        <Card className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-sm text-zinc-500">Precio</div>
          <div className="mt-1 text-2xl font-bold">S/ {formatPEN(p.price_pen)}</div>

          <div className="mt-5 space-y-2 text-sm text-zinc-700">
            <div>
              <span className="font-medium">Dirección:</span> {p.address}
            </div>
            <div>
              <span className="font-medium">Ciudad:</span> {p.city}
            </div>
            <div>
              <span className="font-medium">Distrito:</span> {p.district}
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <a
              className="flex-1 rounded-full bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-zinc-800"
              href={`https://wa.me/?text=${encodeURIComponent(
                `Hola, me interesa esta propiedad: ${p.title} (${p.city}, ${p.district})`
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              Contactar
            </a>

            <a
              className="flex-1 rounded-full border bg-white px-4 py-2 text-center text-sm font-medium hover:bg-zinc-50"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${p.address}, ${p.district}, ${p.city}, Perú`
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              Ver en Maps
            </a>
          </div>
        </Card>
      </div>
    </main>
  );
}