import { requireAdminSession } from "@/lib/auth";

export default async function AdminPage() {
  await requireAdminSession();

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-neutral-900">Admin</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Esta sección está protegida con Supabase Auth (email / password) y una sesión de servidor mínima y roles.
        </p>
      </div>
    </main>
  );
}

