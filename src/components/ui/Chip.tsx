import React from "react";

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

export function Chip({
  children,
  active,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur transition",
        active
          ? "border-neutral-200 bg-white/90 text-neutral-900 shadow-sm"
          : "border-white/25 bg-black/15 text-white hover:bg-black/20",
        className
      )}
    >
      {children}
    </span>
  );
}