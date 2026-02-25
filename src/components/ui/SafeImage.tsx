// src/components/ui/SafeImage.tsx
"use client";

import { useEffect, useState } from "react";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
};

const FALLBACK =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80";

export function SafeImage({ src, alt, className }: Props) {
  const [currentSrc, setCurrentSrc] = useState(src || FALLBACK);

  useEffect(() => {
    setCurrentSrc(src || FALLBACK);
  }, [src]);

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("[SafeImage] src received:", src);
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        setCurrentSrc(FALLBACK);
      }}
    />
  );
}