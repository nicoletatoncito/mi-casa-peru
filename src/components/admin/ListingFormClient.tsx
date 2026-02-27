// src/components/admin/ListingFormClient.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

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

  whatsapp_phone: string;

  featured: boolean;
  verified: boolean;
  status: ListingStatus;
};

type ListingImage = {
  id: string;
  listing_id: string;
  path: string;
  is_cover: boolean;
  sort_order: number;
  created_at: string;
  public_url?: string; // viene del GET
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
  whatsapp_phone: "",
  featured: false,
  verified: false,
  status: "draft",
};

function toPayload(f: AdminListingForm) {
  const numOrNull = (v: string) => (v.trim() ? Number(v) : null);

  const phoneDigits = f.whatsapp_phone.trim()
    ? f.whatsapp_phone.trim().replace(/[^\d]/g, "")
    : null;

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
    whatsapp_phone: phoneDigits,
    featured: f.featured,
    verified: f.verified,
    status: f.status,
  };
}

/** ✅ Supabase client (browser) */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function safeExt(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  return ["jpg", "jpeg", "png", "webp", "avif"].includes(ext) ? ext : "jpg";
}

function cx(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function formatPEN(value?: number | null) {
  if (!value) return "—";
  try {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `S/ ${value}`;
  }
}

function StatusPill({ status }: { status: ListingStatus }) {
  const label =
    status === "draft" ? "Borrador" : status === "published" ? "Publicado" : "Archivado";

  const cls =
    status === "published"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : status === "draft"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-neutral-200 bg-neutral-100 text-neutral-700";

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        cls
      )}
    >
      {label}
    </span>
  );
}

function BadgePill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "dark";
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        tone === "dark"
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-200 bg-white text-neutral-800"
      )}
    >
      {children}
    </span>
  );
}

function Card({
  title,
  subtitle,
  children,
  right,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-100 px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-neutral-600">{subtitle}</p> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-2">
        <label className="text-xs font-semibold text-neutral-700">{label}</label>
        {hint ? <span className="text-[11px] text-neutral-500">{hint}</span> : null}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        "w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition",
        "focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200",
        props.className
      )}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cx(
        "w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition",
        "focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200",
        props.className
      )}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cx(
        "w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition",
        "focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200",
        props.className
      )}
    />
  );
}

function ToggleChip({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cx(
        "flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition",
        checked ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white hover:bg-neutral-50"
      )}
    >
      <span
        className={cx(
          "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
          checked ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white text-transparent"
        )}
        aria-hidden="true"
      >
        ✓
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-neutral-900">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs text-neutral-600">{description}</span>
        ) : null}
      </span>
    </button>
  );
}

/* -----------------------------
   GALERÍA PRO (EDIT MODE)
-------------------------------- */

function getCoverUrl(images: ListingImage[]) {
  const cover = images.find((i) => i.is_cover);
  return cover?.public_url || "";
}

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className="aspect-[4/3] animate-pulse rounded-2xl border border-neutral-200 bg-neutral-100"
        />
      ))}
    </div>
  );
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

  const priceNumber = form.price_pen.trim() ? Number(form.price_pen) : null;
  const previewTitle = form.title.trim() ? form.title.trim() : "Título de la propiedad";
  const previewLocation =
    [form.district.trim() || null, form.city.trim() || null].filter(Boolean).join(", ") ||
    "Ubicación";
  const previewMeta =
    [
      form.beds.trim() ? `${form.beds} dorm` : null,
      form.baths.trim() ? `${form.baths} baños` : null,
      form.area_m2.trim() ? `${form.area_m2} m²` : null,
    ]
      .filter(Boolean)
      .join(" · ") || "Completa los datos para ver el resumen";

  /* -----------------------------
     SAVE + DELETE
  -------------------------------- */

  async function save(methodOverride?: "POST" | "PATCH") {
    setError(null);
    setLoading(true);

    try {
      const payload = toPayload(form);
      const url = mode === "create" ? "/api/admin/listings" : `/api/admin/listings/${id}`;
      const method = methodOverride ?? (mode === "create" ? "POST" : "PATCH");

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await save();
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

  const canPublish = form.title.trim().length > 4 && !!form.lat.trim() && !!form.lng.trim();

  /* -----------------------------
     GALERÍA: state + api
  -------------------------------- */

  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [images, setImages] = useState<ListingImage[]>([]);

  // upload
  const multiInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // reorder
  const [reordering, setReordering] = useState(false);

  async function loadImages() {
    if (mode !== "edit" || !id) return;
    setGalleryError(null);
    setGalleryLoading(true);
    try {
      const res = await fetch(`/api/admin/listings/${id}/images`, { method: "GET" });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        setGalleryError(json?.error ?? "Error cargando imágenes");
        setGalleryLoading(false);
        return;
      }
      const imgs = (json.images ?? []) as ListingImage[];
      setImages(imgs);

      // sync cover -> form.image_url (para preview)
      const cover = getCoverUrl(imgs);
      if (cover && cover !== form.image_url) set("image_url", cover);
      if (!cover && form.image_url) {
        // si no hay cover, no forzamos borrar (a veces listings.image_url se mantiene),
        // pero si quieres forzar, descomenta:
        // set("image_url", "");
      }
    } catch (e: any) {
      setGalleryError(e?.message ?? "Error cargando imágenes");
    } finally {
      setGalleryLoading(false);
    }
  }

  useEffect(() => {
    void loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  async function uploadMultiple(files: FileList | File[]) {
    if (mode !== "edit" || !id) return;
    const list = Array.from(files ?? []);
    if (list.length === 0) return;

    setUploadError(null);
    setUploading(true);

    try {
      const fd = new FormData();
      for (const f of list) {
        fd.append("files", f);
      }
      // si ya hay cover, no lo sobreescribimos al subir nuevas
      const shouldSetCover = images.length === 0 ? "true" : "false";
      fd.set("setCover", shouldSetCover);

      const res = await fetch(`/api/admin/listings/${id}/images`, {
        method: "POST",
        body: fd,
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        setUploadError(json?.error ?? "Error subiendo imágenes");
        setUploading(false);
        return;
      }

      // refresca lista
      await loadImages();
    } catch (e: any) {
      setUploadError(e?.message ?? "Error subiendo imágenes");
    } finally {
      setUploading(false);
    }
  }

  async function setCover(imageId: string) {
    if (mode !== "edit") return;
    setGalleryError(null);
    try {
      const res = await fetch(`/api/admin/listing-images/${imageId}/cover`, { method: "POST" });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        setGalleryError(json?.error ?? "Error marcando portada");
        return;
      }

      // sync UI
      const coverUrl = String(json.cover_url ?? "");
      if (coverUrl) set("image_url", coverUrl);
      await loadImages();
    } catch (e: any) {
      setGalleryError(e?.message ?? "Error marcando portada");
    }
  }

  async function deleteImage(imageId: string) {
    if (mode !== "edit" || !id) return;
    if (!confirm("¿Eliminar esta imagen?")) return;

    setGalleryError(null);
    try {
      const res = await fetch(`/api/admin/listings/${id}/images?imageId=${encodeURIComponent(imageId)}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        setGalleryError(json?.error ?? "Error eliminando imagen");
        return;
      }

      await loadImages();
    } catch (e: any) {
      setGalleryError(e?.message ?? "Error eliminando imagen");
    }
  }

  function moveImage(index: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;

      const a = next[index];
      const b = next[target];
      next[index] = b;
      next[target] = a;

      return next;
    });
  }

  async function saveOrder() {
    if (mode !== "edit" || !id) return;
    setGalleryError(null);
    setReordering(true);

    try {
      const orderedIds = images.map((x) => x.id);
      const res = await fetch(`/api/admin/listings/${id}/images`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        setGalleryError(json?.error ?? "Error guardando orden");
        setReordering(false);
        return;
      }
      await loadImages();
    } catch (e: any) {
      setGalleryError(e?.message ?? "Error guardando orden");
    } finally {
      setReordering(false);
    }
  }

  /* -----------------------------
     COVER UPLOADER (create mode)
     Mantengo tu cover uploader por si deseas
     una portada desde create (aunque no tenga listing_images aún).
  -------------------------------- */

  const coverFileRef = useRef<HTMLInputElement | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);

  async function uploadCoverImageToStorageOnly(file: File) {
    setCoverError(null);
    setUploadingCover(true);

    try {
      const bucket = "listing-images";
      const ext = safeExt(file);
      const filePath = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;

      const { error: upErr } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });

      if (upErr) throw upErr;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      set("image_url", data.publicUrl);
    } catch (e: any) {
      setCoverError(e?.message ?? "Error subiendo imagen");
    } finally {
      setUploadingCover(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* ✅ Toolbar senior */}
      <div className="sticky top-0 z-10 -mx-2 rounded-3xl border border-neutral-200 bg-white/80 p-3 shadow-sm backdrop-blur sm:mx-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-neutral-600">
              {mode === "create" ? "Nueva propiedad" : "Editar propiedad"}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h1 className="truncate text-base font-semibold text-neutral-900">{previewTitle}</h1>
              <StatusPill status={form.status} />
              {form.featured ? <BadgePill>Destacado</BadgePill> : null}
              {form.verified ? <BadgePill>Verificado</BadgePill> : null}
            </div>
            <p className="mt-1 text-xs text-neutral-600">
              {form.operation === "venta" ? "Venta" : "Alquiler"} · {form.property_type} ·{" "}
              {previewLocation}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50"
            >
              Ver web
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                set("status", "draft");
                void save();
              }}
              className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-60"
            >
              Guardar borrador
            </button>

            <button
              type="button"
              disabled={loading || !canPublish}
              onClick={() => {
                set("status", "published");
                void save();
              }}
              className="rounded-2xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
              title={!canPublish ? "Completa título y ubicación (lat/lng)" : undefined}
            >
              {loading ? "Guardando..." : "Publicar"}
            </button>
          </div>
        </div>

        {error ? <p className="mt-2 text-xs font-semibold text-red-600">{error}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          {/* Información */}
          <Card title="Información" subtitle="Define lo esencial: título, operación, precio y tipo.">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Título" hint="Aparece en cards y SEO">
                  <Input
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    required
                    placeholder="Ej: Departamento moderno con vista al mar"
                  />
                </Field>
              </div>

              <Field label="Operación">
                <Select value={form.operation} onChange={(e) => set("operation", e.target.value as Operation)}>
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                </Select>
              </Field>

              <Field label="Estado" hint='“Borrador” no sale en público'>
                <Select value={form.status} onChange={(e) => set("status", e.target.value as ListingStatus)}>
                  <option value="draft">Borrador (oculto)</option>
                  <option value="published">Publicado (visible)</option>
                  <option value="archived">Archivado</option>
                </Select>
              </Field>

              <Field label="Tipo">
                <Input
                  value={form.property_type}
                  onChange={(e) => set("property_type", e.target.value)}
                  required
                  placeholder="Departamento / Casa / Terreno..."
                />
              </Field>

              <Field label="Precio (PEN)" hint="Solo números">
                <Input
                  value={form.price_pen}
                  onChange={(e) => set("price_pen", e.target.value.replace(/[^\d]/g, ""))}
                  inputMode="numeric"
                  placeholder="Ej: 850000"
                />
              </Field>
            </div>
          </Card>

          {/* Ubicación */}
          <Card title="Ubicación" subtitle="Ayuda al cliente a ubicar la propiedad rápidamente.">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Ciudad">
                <Input value={form.city} onChange={(e) => set("city", e.target.value)} required />
              </Field>

              <Field label="Distrito" hint="Ej: Miraflores">
                <Input value={form.district} onChange={(e) => set("district", e.target.value)} placeholder="Ej: Miraflores" />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Dirección" hint="Opcional">
                  <Input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Ej: Av. X 123" />
                </Field>
              </div>

              <Field label="Lat" hint="Obligatorio">
                <Input value={form.lat} onChange={(e) => set("lat", e.target.value)} placeholder="-12.1212" required />
              </Field>

              <Field label="Lng" hint="Obligatorio">
                <Input value={form.lng} onChange={(e) => set("lng", e.target.value)} placeholder="-77.0303" required />
              </Field>

              <div className="sm:col-span-2">
                <p className="text-[11px] text-neutral-500">
                  Tip senior: luego podemos poner un mapa con pin arrastrable para que sea 10/10.
                </p>
              </div>
            </div>
          </Card>

          {/* Características */}
          <Card
            title="Características"
            subtitle="Lo que más comparan los usuarios: dormitorios, baños, área, estacionamientos."
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Dormitorios">
                <Input
                  value={form.beds}
                  onChange={(e) => set("beds", e.target.value.replace(/[^\d]/g, ""))}
                  inputMode="numeric"
                  placeholder="0"
                />
              </Field>

              <Field label="Baños">
                <Input
                  value={form.baths}
                  onChange={(e) => set("baths", e.target.value.replace(/[^\d]/g, ""))}
                  inputMode="numeric"
                  placeholder="0"
                />
              </Field>

              <Field label="Estacionamientos">
                <Input
                  value={form.parking}
                  onChange={(e) => set("parking", e.target.value.replace(/[^\d]/g, ""))}
                  inputMode="numeric"
                  placeholder="0"
                />
              </Field>

              <Field label="Área (m²)">
                <Input
                  value={form.area_m2}
                  onChange={(e) => set("area_m2", e.target.value.replace(/[^\d.]/g, ""))}
                  inputMode="decimal"
                  placeholder="0"
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Descripción" hint="Venta: ventajas + ubicación + distribución">
                <Textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="min-h-[140px]"
                  placeholder="Ej: Departamento con excelente iluminación natural, cerca a parques, seguridad 24/7..."
                />
              </Field>
            </div>
          </Card>

          {/* FOTOS: CREATE (cover simple) / EDIT (galería pro) */}
          <Card
            title="Fotos"
            subtitle={
              mode === "edit"
                ? "Sube varias imágenes, elige portada, reordena y elimina. Esto ya es panel inmobiliario pro."
                : "Primero guarda la propiedad para activar la galería pro (múltiples imágenes + portada). Mientras tanto puedes subir una portada preliminar."
            }
            right={
              form.image_url ? <BadgePill tone="dark">Portada lista</BadgePill> : <BadgePill>Sin portada</BadgePill>
            }
          >
            {mode !== "edit" || !id ? (
              // CREATE MODE: cover “preliminar” (no toca listing_images)
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-neutral-600">
                    {form.image_url ? (
                      <span className="font-semibold text-neutral-900">Portada preliminar lista</span>
                    ) : (
                      <span>Sube una portada (jpg/png/webp/avif)</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => coverFileRef.current?.click()}
                      disabled={uploadingCover}
                      className="rounded-2xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
                    >
                      {uploadingCover ? "Subiendo..." : "Subir portada"}
                    </button>

                    {form.image_url ? (
                      <button
                        type="button"
                        onClick={() => set("image_url", "")}
                        className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50"
                      >
                        Quitar
                      </button>
                    ) : null}
                  </div>
                </div>

                <div
                  className="mt-3 grid h-28 place-items-center rounded-2xl border border-dashed border-neutral-200 bg-white text-xs text-neutral-600"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files?.[0];
                    if (f) void uploadCoverImageToStorageOnly(f);
                  }}
                >
                  Arrastra y suelta aquí
                </div>

                <input
                  ref={coverFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void uploadCoverImageToStorageOnly(f);
                  }}
                />

                {form.image_url ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image_url} alt="preview" className="h-56 w-full object-cover" />
                  </div>
                ) : null}

                {coverError ? <p className="mt-2 text-xs font-semibold text-red-600">{coverError}</p> : null}

                <div className="mt-3">
                  <label className="text-[11px] font-semibold text-neutral-600">URL (opcional)</label>
                  <Input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} placeholder="https://..." />
                </div>

                <div className="mt-3 rounded-2xl border border-neutral-200 bg-white p-3">
                  <p className="text-xs font-semibold text-neutral-900">Siguiente paso</p>
                  <p className="mt-1 text-xs text-neutral-600">
                    Guarda la propiedad y luego entra a <span className="font-semibold">Editar</span> para activar la galería pro.
                  </p>
                </div>
              </div>
            ) : (
              // EDIT MODE: galería pro
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-neutral-900">Gestión de imágenes</p>
                    <p className="mt-0.5 text-xs text-neutral-600">
                      Subida múltiple, portada, orden y eliminación.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => multiInputRef.current?.click()}
                      disabled={uploading}
                      className="rounded-2xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
                    >
                      {uploading ? "Subiendo..." : "Subir imágenes"}
                    </button>

                    <button
                      type="button"
                      onClick={() => void loadImages()}
                      disabled={galleryLoading}
                      className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-60"
                    >
                      {galleryLoading ? "Actualizando..." : "Actualizar"}
                    </button>

                    <button
                      type="button"
                      onClick={() => void saveOrder()}
                      disabled={reordering || images.length < 2}
                      className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-60"
                      title={images.length < 2 ? "Necesitas al menos 2 imágenes" : "Guardar orden"}
                    >
                      {reordering ? "Guardando orden..." : "Guardar orden"}
                    </button>
                  </div>

                  <input
                    ref={multiInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) void uploadMultiple(files);
                      // reset para permitir subir el mismo archivo otra vez
                      e.currentTarget.value = "";
                    }}
                  />
                </div>

                {(galleryError || uploadError) ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                    {galleryError || uploadError}
                  </div>
                ) : null}

                <div
                  className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-4"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files && files.length > 0) void uploadMultiple(files);
                  }}
                >
                  <p className="text-xs font-semibold text-neutral-900">Arrastra y suelta aquí</p>
                  <p className="mt-1 text-xs text-neutral-600">
                    Puedes subir varias imágenes en una sola acción.
                  </p>
                </div>

                {galleryLoading ? (
                  <GallerySkeleton />
                ) : images.length === 0 ? (
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <p className="text-sm font-semibold text-neutral-900">Aún no hay imágenes</p>
                    <p className="mt-1 text-sm text-neutral-600">
                      Sube fotos para mejorar conversión. La primera puede convertirse en portada automáticamente.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {images.map((img, idx) => (
                      <div
                        key={img.id}
                        className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white"
                      >
                        <div className="relative aspect-[4/3] w-full bg-neutral-100">
                          {img.public_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={img.public_url}
                              alt="listing"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="grid h-full place-items-center text-xs font-semibold text-neutral-500">
                              Sin preview
                            </div>
                          )}

                          <div className="absolute left-2 top-2 flex items-center gap-2">
                            {img.is_cover ? (
                              <span className="rounded-full border border-neutral-900 bg-neutral-900 px-2 py-0.5 text-[11px] font-semibold text-white">
                                Portada
                              </span>
                            ) : (
                              <span className="rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-neutral-800">
                                Foto
                              </span>
                            )}
                          </div>

                          <div className="absolute right-2 top-2 flex items-center gap-2">
                            <span className="rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-neutral-700">
                              #{idx + 1}
                            </span>
                          </div>
                        </div>

                        <div className="p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => void setCover(img.id)}
                              className="rounded-xl bg-neutral-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-neutral-800"
                              disabled={img.is_cover}
                              title={img.is_cover ? "Ya es portada" : "Marcar como portada"}
                            >
                              {img.is_cover ? "Portada" : "Hacer portada"}
                            </button>

                            <button
                              type="button"
                              onClick={() => void deleteImage(img.id)}
                              className="rounded-xl border border-red-200 bg-white px-3 py-2 text-[11px] font-semibold text-red-700 hover:bg-red-50"
                            >
                              Eliminar
                            </button>
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => moveImage(idx, -1)}
                                disabled={idx === 0}
                                className="rounded-xl border border-neutral-200 bg-white px-2 py-1.5 text-[11px] font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
                                title="Mover arriba"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => moveImage(idx, 1)}
                                disabled={idx === images.length - 1}
                                className="rounded-xl border border-neutral-200 bg-white px-2 py-1.5 text-[11px] font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
                                title="Mover abajo"
                              >
                                ↓
                              </button>
                            </div>

                            {img.is_cover ? (
                              <span className="text-[11px] font-semibold text-neutral-700">
                                Usada en cards
                              </span>
                            ) : (
                              <span className="text-[11px] text-neutral-500">—</span>
                            )}
                          </div>

                          <p className="mt-2 truncate text-[11px] text-neutral-500">
                            {img.path}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs font-semibold text-neutral-900">Tip senior</p>
                  <p className="mt-1 text-xs text-neutral-600">
                    Pon 8–15 fotos: sala, cocina, dormitorios, baños, fachada y entorno. La portada debe ser la mejor.
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Contacto */}
          <Card title="Contacto" subtitle="Define el WhatsApp para cerrar rápido. (Luego lo conectamos a leads.)">
            <Field label="WhatsApp del dueño" hint="Solo dígitos, ej: 51939226632">
              <Input
                value={form.whatsapp_phone}
                onChange={(e) => set("whatsapp_phone", e.target.value)}
                placeholder="51939226632"
              />
            </Field>
            <p className="mt-2 text-[11px] text-neutral-500">
              Consejo: guarda con país incluido (51 + número).
            </p>
          </Card>

          {/* Visibilidad */}
          <Card title="Visibilidad" subtitle="Señales de confianza para el usuario.">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ToggleChip
                checked={form.featured}
                onChange={(v) => set("featured", v)}
                label="Destacado"
                description="Aparece primero y con más visibilidad."
              />
              <ToggleChip
                checked={form.verified}
                onChange={(v) => set("verified", v)}
                label="Verificado"
                description="Incrementa confianza y conversiones."
              />
            </div>
          </Card>

          {/* Acciones abajo */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>

            <button
              type="button"
              onClick={() => {
                router.push("/admin");
                router.refresh();
              }}
              className="rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
            >
              Cancelar
            </button>

            {mode === "edit" ? (
              <button
                type="button"
                onClick={onDelete}
                disabled={loading}
                className="ml-auto rounded-2xl border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 shadow-sm hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Eliminar
              </button>
            ) : null}
          </div>
        </div>

        {/* Preview lateral */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-4">
            <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
              <div className="border-b border-neutral-100 px-5 py-4">
                <h3 className="text-sm font-semibold text-neutral-900">Vista previa</h3>
                <p className="mt-0.5 text-xs text-neutral-600">Así se verá la tarjeta (estimación).</p>
              </div>

              <div className="p-5">
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
                  <div className="aspect-[16/10] w-full bg-neutral-100">
                    {form.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.image_url} alt="preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-xs text-neutral-500">
                        Sin portada
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-neutral-900">{previewTitle}</p>
                      {form.featured ? <BadgePill>Destacado</BadgePill> : null}
                      {form.verified ? <BadgePill>Verificado</BadgePill> : null}
                    </div>

                    <p className="mt-1 text-xs text-neutral-600">{previewLocation}</p>

                    <p className="mt-3 text-base font-semibold text-neutral-900">
                      {formatPEN(priceNumber)}
                      <span className="ml-2 text-xs font-semibold text-neutral-500">
                        {form.operation === "venta" ? "Venta" : "Alquiler"}
                      </span>
                    </p>

                    <p className="mt-2 text-xs text-neutral-600">{previewMeta}</p>

                    <div className="mt-3 flex items-center gap-2">
                      <StatusPill status={form.status} />
                      <BadgePill>{form.property_type || "Tipo"}</BadgePill>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                  <p className="text-xs font-semibold text-neutral-900">Checklist senior</p>
                  <ul className="mt-2 space-y-1 text-xs text-neutral-600">
                    <li className={cx(form.title.trim() ? "text-neutral-700" : "text-neutral-400")}>
                      • Título claro
                    </li>
                    <li className={cx(form.image_url.trim() ? "text-neutral-700" : "text-neutral-400")}>
                      • Portada
                    </li>
                    <li className={cx(form.lat.trim() && form.lng.trim() ? "text-neutral-700" : "text-neutral-400")}>
                      • Ubicación (lat/lng)
                    </li>
                    <li className={cx(form.description.trim() ? "text-neutral-700" : "text-neutral-400")}>
                      • Descripción
                    </li>
                    <li className={cx(form.whatsapp_phone.trim() ? "text-neutral-700" : "text-neutral-400")}>
                      • WhatsApp
                    </li>
                    <li className={cx(mode === "edit" && images.length > 0 ? "text-neutral-700" : "text-neutral-400")}>
                      • Galería (varias fotos)
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </form>
  );
}