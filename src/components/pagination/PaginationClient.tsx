// src/components/pagination/PaginationClient.tsx
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function buildHref(pathname: string, sp: URLSearchParams, page: number) {
  const params = new URLSearchParams(sp.toString());
  if (page <= 1) params.delete("page");
  else params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function PaginationClient({
  page,
  totalPages,
  total,
  pageSize,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}) {
  const pathname = usePathname();
  const sp = useSearchParams() as unknown as URLSearchParams;

  if (totalPages <= 1) return null;

  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="mt-4 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-600">
          Mostrando <span className="font-semibold text-neutral-900">{from}</span>–
          <span className="font-semibold text-neutral-900">{to}</span> de{" "}
          <span className="font-semibold text-neutral-900">{total}</span>
        </p>

        <div className="flex items-center gap-2">
          <Link
            scroll={false}
            href={buildHref(pathname, sp, prev)}
            aria-disabled={page <= 1}
            className={cn(
              "rounded-2xl border px-3 py-2 text-xs font-semibold shadow-sm",
              page <= 1
                ? "pointer-events-none border-neutral-200 bg-neutral-50 text-neutral-400"
                : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
            )}
          >
            ← Anterior
          </Link>

          <div className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700">
            Página <span className="font-semibold text-neutral-900">{page}</span> de{" "}
            <span className="font-semibold text-neutral-900">{totalPages}</span>
          </div>

          <Link
            scroll={false}
            href={buildHref(pathname, sp, next)}
            aria-disabled={page >= totalPages}
            className={cn(
              "rounded-2xl border px-3 py-2 text-xs font-semibold shadow-sm",
              page >= totalPages
                ? "pointer-events-none border-neutral-200 bg-neutral-50 text-neutral-400"
                : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
            )}
          >
            Siguiente →
          </Link>
        </div>
      </div>
    </div>
  );
}