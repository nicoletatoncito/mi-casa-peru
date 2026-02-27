// src/components/admin/ImageUploader.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

type Props = {
  bucket?: string;
  folderPrefix?: string; // ✅ ej: `listings/${listingId}`
  value?: string;
  onUploaded: (publicUrl: string) => void;
  onClear?: () => void;
  title?: string;
  subtitle?: string;
  maxMB?: number; // ✅ control SaaS
};

function cx(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function safeExt(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  return ["jpg", "jpeg", "png", "webp", "avif"].includes(ext) ? ext : "jpg";
}

export default function ImageUploader({
  bucket = "listing-images",
  folderPrefix,
  value,
  onUploaded,
  onClear,
  title = "Imagen",
  subtitle = "Sube una foto (jpg/png/webp/avif).",
  maxMB = 8,
}: Props) {
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasValue = useMemo(() => !!value?.trim(), [value]);

  async function handleFile(file: File) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Archivo inválido (solo imágenes).");
      return;
    }
    const maxBytes = maxMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`Imagen muy pesada (máx ${maxMB}MB).`);
      return;
    }

    setUploading(true);

    try {
      const ext = safeExt(file);
      const name = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
      const path = folderPrefix ? `${folderPrefix}/${name}` : name;

      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });

      if (upErr) throw upErr;

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onUploaded(data.publicUrl);
    } catch (e: any) {
      setError(e?.message ?? "Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-100 px-5 py-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
          <p className="mt-0.5 text-xs text-neutral-600">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-2xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
            disabled={uploading}
          >
            {uploading ? "Subiendo..." : "Subir"}
          </button>

          {hasValue && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50"
              disabled={uploading}
            >
              Quitar
            </button>
          ) : null}
        </div>
      </div>

      <div className="px-5 py-4">
        <div
          className={cx(
            "grid h-28 place-items-center rounded-2xl border border-dashed bg-neutral-50 text-xs text-neutral-600",
            "border-neutral-200"
          )}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) void handleFile(f);
          }}
        >
          Arrastra y suelta aquí
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
        />

        {hasValue ? (
          <div className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" className="h-56 w-full object-cover" />
          </div>
        ) : null}

        {error ? <p className="mt-2 text-xs font-semibold text-red-600">{error}</p> : null}
      </div>
    </section>
  );
}