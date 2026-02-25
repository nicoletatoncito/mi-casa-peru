// src/app/admin/new/page.tsx
import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";
import { ListingFormClient } from "@/components/admin/ListingFormClient";

export default async function AdminNewPage() {
  await requireAdminSession();

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">Nueva propiedad</h1>
              <p className="mt-1 text-sm text-neutral-600">
                Crea una publicación (draft por defecto).
              </p>
            </div>
            <Link
              href="/admin"
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
            >
              Volver
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <ListingFormClient mode="create" />
        </div>
      </div>
    </main>
  );
}