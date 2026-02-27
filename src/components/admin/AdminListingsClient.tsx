"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Operation = "venta" | "alquiler";
type Status = "draft" | "published" | "archived";

function cx(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function buildQS(params: Record<string, string | undefined | null>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    const vv = (v ?? "").trim();
    if (vv) sp.set(k, vv);
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export function ClientActions({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string | null | undefined;
}) {
  const router = useRouter();
  const s = (currentStatus ?? "draft").toLowerCase();

  const [busy, setBusy] = useState<null | "status" | "duplicate">(null);

  async function patchStatus(status: Status) {
    const ok = confirm(
      status === "published"
        ? "¿Publicar esta propiedad?"
        : status === "archived"
        ? "¿Archivar esta propiedad?"
        : "¿Pasar a borrador (ocultar) esta propiedad?"
    );
    if (!ok) return;

    setBusy("status");
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        alert(json?.error ?? "Error cambiando estado");
        return;
      }

      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function duplicate() {
    const ok = confirm("¿Duplicar esta propiedad? Se creará como borrador.");
    if (!ok) return;

    setBusy("duplicate");
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate" }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        alert(json?.error ?? "Error duplicando");
        return;
      }

      const to = String(json?.redirectTo ?? "");
      if (to) {
        router.push(to);
        router.refresh();
        return;
      }

      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function copyId() {
    try {
      await navigator.clipboard.writeText(id);
      alert("ID copiado ✅");
    } catch {
      alert("No se pudo copiar. Copia manual: " + id);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/propiedades/${id}`}
        className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
      >
        Ver público
      </Link>

      <Link
        href={`/admin/listings/${id}`}
        className="rounded-2xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800"
      >
        Editar
      </Link>

      <details className="relative">
        <summary className="cursor-pointer list-none rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50">
          {busy ? "Procesando..." : "Acciones ▾"}
        </summary>

        <div className="absolute right-0 z-10 mt-2 w-60 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg">
          <button
            type="button"
            onClick={() => void patchStatus("published")}
            disabled={!!busy}
            className={cx(
              "w-full px-4 py-3 text-left text-xs font-semibold hover:bg-neutral-50 disabled:opacity-60",
              s === "published" ? "text-emerald-700" : "text-neutral-900"
            )}
          >
            Publicar
          </button>

          <button
            type="button"
            onClick={() => void patchStatus("draft")}
            disabled={!!busy}
            className={cx(
              "w-full px-4 py-3 text-left text-xs font-semibold hover:bg-neutral-50 disabled:opacity-60",
              s === "draft" ? "text-amber-700" : "text-neutral-900"
            )}
          >
            Pasar a borrador
          </button>

          <button
            type="button"
            onClick={() => void patchStatus("archived")}
            disabled={!!busy}
            className={cx(
              "w-full px-4 py-3 text-left text-xs font-semibold hover:bg-neutral-50 disabled:opacity-60",
              s === "archived" ? "text-neutral-700" : "text-neutral-900"
            )}
          >
            Archivar
          </button>

          <div className="h-px bg-neutral-100" />

          <button
            type="button"
            onClick={() => void duplicate()}
            disabled={!!busy}
            className="w-full px-4 py-3 text-left text-xs font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-60"
          >
            Duplicar (borrador)
          </button>

          <button
            type="button"
            onClick={() => void copyId()}
            disabled={!!busy}
            className="w-full px-4 py-3 text-left text-xs font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-60"
          >
            Copiar ID
          </button>
        </div>
      </details>
    </div>
  );
}

export function ClientFilters({
  basePath,
  q,
  status,
  op,
}: {
  basePath: string; // "/admin/listings"
  q: string;
  status: Status | "all";
  op: Operation | "all";
}) {
  const router = useRouter();

  const [text, setText] = useState(q);

  const current = useMemo(
    () => ({
      q,
      status: status === "all" ? "" : status,
      op: op === "all" ? "" : op,
    }),
    [q, status, op]
  );

  function go(next: { q?: string; status?: string; op?: string }) {
    const qs = buildQS({
      q: next.q ?? current.q,
      status: next.status ?? current.status,
      op: next.op ?? current.op,
    });
    router.push(`${basePath}${qs}`);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-start gap-2">
        <div className="w-full sm:w-80">
          <input
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
            placeholder="Buscar por título, distrito, ciudad..."
            className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                go({ q: (text ?? "").trim() });
              }
            }}
          />
          <p className="mt-1 text-[11px] text-neutral-500">Enter para buscar.</p>
        </div>

        <select
          value={status}
          className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
          onChange={(e) => go({ status: e.target.value === "all" ? "" : e.target.value })}
        >
          <option value="all">Todos</option>
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
          <option value="archived">Archivado</option>
        </select>

        <select
          value={op}
          className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
          onChange={(e) => go({ op: e.target.value === "all" ? "" : e.target.value })}
        >
          <option value="all">Todas</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setText("");
            router.push(basePath);
            router.refresh();
          }}
          className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}