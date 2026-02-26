// src/app/propiedades/[id]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import SafeImage from "@/components/ui/SafeImage";
import { getPropertyByIdPublic } from "@/lib/db/properties";

type Props = {
  params: Promise<{ id: string }>;
};

function formatPEN(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) return "Precio a consultar";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizePhoneDigits(phone?: string | null) {
  const digits = (phone ?? "").replace(/[^\d]/g, "");
  return digits.length >= 9 ? digits : "";
}

function buildWhatsAppHref(phoneDigits: string, text: string) {
  const normalized = phoneDigits.replace(/[^\d]/g, "");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyByIdPublic(id);

  if (!property) {
    return {
      title: "Propiedad no encontrada | Mi Casa Perú",
      description: "La propiedad solicitada no existe o fue removida.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${property.title} | Mi Casa Perú`;
  const description =
    property.description?.trim().slice(0, 160) || "Propiedad disponible en Mi Casa Perú.";

  const images = property.image_url ? [property.image_url] : [];

  return {
    title,
    description,
    alternates: { canonical: `/propiedades/${property.id}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/propiedades/${property.id}`,
      images,
    },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title,
      description,
      images,
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const property = await getPropertyByIdPublic(id);
  if (!property) return notFound();

  const subtitle = [property.district, property.city].filter(Boolean).join(", ");
  const price =
    property.operation === "alquiler"
      ? `${formatPEN(property.price_pen)}/mes`
      : formatPEN(property.price_pen);

  const whatsappDigits = normalizePhoneDigits(property.whatsapp_phone);
  const whatsappText = `Hola! Quiero información de: ${property.title} (ID: ${property.id})`;
  const whatsappHref = whatsappDigits ? buildWhatsAppHref(whatsappDigits, whatsappText) : "";

  const metaBadges = [
    property.property_type,
    typeof property.beds === "number" ? `${property.beds} dorm.` : null,
    typeof property.baths === "number" ? `${property.baths} baños` : null,
    typeof property.parking === "number" ? `${property.parking} estac.` : null,
    typeof property.area_m2 === "number" ? `${property.area_m2} m²` : null,
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-neutral-500">MI CASA PERÚ</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
                {property.title}
              </h1>
              <p className="mt-1 text-sm text-neutral-600">
                {subtitle || "Perú"} • {property.operation} • {property.property_type}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {property.featured ? (
                  <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-semibold text-neutral-700">
                    DESTACADO
                  </span>
                ) : null}
                {property.verified ? (
                  <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-semibold text-neutral-700">
                    VERIFICADO
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/propiedades"
                className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
              >
                ← Volver
              </Link>

              {whatsappDigits ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-green-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-green-700"
                >
                  WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
              <div className="relative h-[360px] w-full bg-neutral-100">
                {property.image_url ? (
                  <SafeImage
                    src={property.image_url}
                    alt={property.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="h-full w-full bg-[radial-gradient(1200px_circle_at_10%_10%,rgba(15,23,42,0.18),transparent_40%),radial-gradient(900px_circle_at_90%_30%,rgba(99,102,241,0.18),transparent_40%),linear-gradient(to_bottom,rgba(0,0,0,0.04),rgba(0,0,0,0.02))]" />
                )}

                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/45 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white drop-shadow-sm">
                      {property.title}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-white/90 drop-shadow-sm">
                      {subtitle || "Perú"}
                    </p>
                  </div>
                  <p className="shrink-0 text-right text-base font-semibold text-white drop-shadow-sm">
                    {price}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {metaBadges.map((b) => (
                    <span
                      key={String(b)}
                      className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {property.address ? (
                  <p className="mt-4 text-sm text-neutral-700">
                    <span className="font-semibold">Dirección:</span> {property.address}
                  </p>
                ) : null}

                {property.description ? (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-neutral-900">Descripción</p>
                    <p className="mt-1 whitespace-pre-line text-sm text-neutral-700">
                      {property.description}
                    </p>
                  </div>
                ) : null}

                {typeof property.lat === "number" && typeof property.lng === "number" ? (
                  <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="text-xs font-semibold text-neutral-900">Ubicación</p>
                    <p className="mt-1 text-xs text-neutral-600">
                      Coordenadas: {property.lat}, {property.lng}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-4">
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-neutral-900">Solicitar información</h2>
                <p className="mt-1 text-sm text-neutral-600">Déjanos tus datos y te contactaremos.</p>

                <form className="mt-4 space-y-3" action="/api/leads" method="post">
                  <input type="hidden" name="listing_id" value={property.id} />

                  <div>
                    <label className="text-xs font-semibold text-neutral-700">Nombre</label>
                    <input
                      name="name"
                      required
                      className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700">
                      Teléfono (opcional)
                    </label>
                    <input
                      name="phone"
                      className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                      placeholder="Ej: 999 999 999"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700">
                      Mensaje (opcional)
                    </label>
                    <textarea
                      name="message"
                      className="mt-1 min-h-[120px] w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                      placeholder="Hola, quiero más info sobre esta propiedad..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800"
                  >
                    Enviar
                  </button>

                  {whatsappDigits ? (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-center text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
                    >
                      Contactar por WhatsApp
                    </a>
                  ) : (
                    <p className="text-xs text-neutral-500">
                      El dueño aún no configuró WhatsApp para esta propiedad.
                    </p>
                  )}
                </form>

                <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-xs font-semibold text-neutral-900">Precio</p>
                  <p className="mt-1 text-xl font-semibold text-neutral-900">{price}</p>
                  <p className="mt-1 text-xs text-neutral-600">
                    Operación:{" "}
                    <span className="font-semibold text-neutral-800">{property.operation}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {whatsappDigits ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-green-700 lg:hidden"
          aria-label="Contactar por WhatsApp"
        >
          <span className="text-base">💬</span>
          WhatsApp
        </a>
      ) : null}
    </main>
  );
}