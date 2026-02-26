"use client";

import { useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  bucket?: string;
  onUploaded: (publicUrl: string) => void;
};

export default function ImageUploader({
  bucket = "listing-images",
  onUploaded,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);

    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeExt = ["jpg", "jpeg", "png", "webp", "avif"].includes(ext)
        ? ext
        : "jpg";

      const filePath = `${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}.${safeExt}`;

      const { error: upErr } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });

      if (upErr) throw upErr;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      onUploaded(publicUrl);
    } catch (e: any) {
      setError(e?.message ?? "Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900">Imagen</p>
          <p className="text-xs text-neutral-600">
            Sube una foto (jpg/png/webp/avif).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
            disabled={uploading}
          >
            {uploading ? "Subiendo..." : "Subir"}
          </button>
        </div>
      </div>

      <div
        className="mt-3 grid h-28 place-items-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50 text-xs text-neutral-600"
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

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}