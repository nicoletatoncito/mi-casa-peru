"use client";

import * as React from "react";

type Props = {
  propertyId: string;
  className?: string;
};

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem("favorites");
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeFavorites(list: string[]) {
  localStorage.setItem("favorites", JSON.stringify(list));
}

export default function FavoriteButton({ propertyId, className }: Props) {
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const list = readFavorites();
    setActive(list.includes(propertyId));
  }, [propertyId]);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    // ✅ Evita que al click te mande al detalle (si hay links cerca)
    e.preventDefault();
    e.stopPropagation();

    const list = readFavorites();
    const next = list.includes(propertyId)
      ? list.filter((id) => id !== propertyId)
      : [...list, propertyId];

    writeFavorites(next);
    setActive(next.includes(propertyId));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      aria-label={active ? "Quitar de favoritos" : "Guardar en favoritos"}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/80 shadow-sm backdrop-blur",
        "transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200/70",
        className
      )}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        className={cn(active ? "text-rose-500" : "text-zinc-800")}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 21s-7-4.35-9.33-8.28C.9 9.33 2.46 6.5 5.6 6.5c1.74 0 3.06.86 3.9 2.02.84-1.16 2.16-2.02 3.9-2.02 3.14 0 4.7 2.83 2.93 6.22C19 16.65 12 21 12 21z" />
      </svg>
    </button>
  );
}
