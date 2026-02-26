"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";

type Props = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
};

function normalizeUrl(u: string) {
  // 1) trim
  let url = u.trim();

  // 2) arregla "//" después del hostname (https://host//path -> https://host/path)
  url = url.replace(/^(https?:\/\/[^/]+)\/{2,}/, "$1/");

  // 3) normaliza rutas supabase antiguas
  url = url
    .replace(
      /\.supabase\.co\/v1\/object\/public\//,
      ".supabase.co/storage/v1/object/public/"
    )
    .replace(
      /\.supabase\.co\/v1\/object\/sign\//,
      ".supabase.co/storage/v1/object/sign/"
    );

  return url;
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc = "/placeholder.jpg",
  ...props
}: Props) {
  const safeSrc = useMemo(() => {
    const s = (src ?? "").trim();
    if (!s) return fallbackSrc;
    if (s.startsWith("http")) return normalizeUrl(s);
    return s; // rutas locales /public
  }, [src, fallbackSrc]);

  const [currentSrc, setCurrentSrc] = useState<string>(safeSrc);

  useEffect(() => {
    setCurrentSrc(safeSrc);
  }, [safeSrc]);

  const anyProps: any = props;
  const hasFill = !!anyProps.fill;

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      width={hasFill ? undefined : (anyProps.width ?? 1200)}
      height={hasFill ? undefined : (anyProps.height ?? 800)}
      onError={() => setCurrentSrc(fallbackSrc)}
    />
  );
}