import Header from "@/components/layout/Header";
import HeroSearchClient from "@/components/hero/HeroSearchClient";
import PeruMapSection from "@/components/maps/PeruMapSection";
import { fetchAllProperties } from "@/lib/db/properties";

export default async function HomePage() {
  const all = await fetchAllProperties();

  const mapItems = all
    .filter((p) => typeof p.lat === "number" && typeof p.lng === "number")
    .slice(0, 12)
    .map((p) => ({
      id: p.id,
      title: p.title,
      city: p.city,
      district: p.district,
      address: p.address ?? "",
      pricePen: p.price_pen,
      operation: p.operation,
      type: p.type,
      lat: p.lat as number,
      lng: p.lng as number,
    }));

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10">
        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950 shadow-[0_40px_160px_-80px_rgba(0,0,0,0.8)]">
          {/* Background image */}
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1560185008-b033106af5d6?auto=format&fit=crop&w=2400&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/20" />
          <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_20%,rgba(140,120,255,0.25),transparent_40%),radial-gradient(900px_circle_at_70%_60%,rgba(56,189,248,0.18),transparent_45%)]" />

          <div className="relative grid gap-8 p-7 md:grid-cols-12 md:p-10">
            {/* Left */}
            <div className="md:col-span-7">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                  Agentes verificados
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                  Mapa en tiempo real
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                  Detalle completo
                </span>
              </div>

              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Encuentra tu casa ideal en todo el Perú.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
                Búsqueda rápida por ciudad, tipo y operación. Experiencia premium
                con mapa interactivo y tarjetas pro.
              </p>

              <div className="mt-6">
                <HeroSearchClient />
              </div>
            </div>

            {/* Right map preview */}
            <div className="md:col-span-5">
              <div className="rounded-3xl border border-white/12 bg-white/8 p-3 backdrop-blur-xl">
                <div className="flex items-center justify-between px-2 pb-2">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Explora el mapa
                    </div>
                    <div className="text-xs text-white/55">
                      Vista previa de ubicaciones
                    </div>
                  </div>
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                    Perú
                  </span>
                </div>

                <PeruMapSection items={mapItems} height={360} />
                <div className="px-2 pt-2 text-xs text-white/50">
                  Consejo: si quieres pins exactos, guarda lat/lng para cada
                  propiedad en tu dataset.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}