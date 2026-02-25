// src/app/propiedades/error.tsx
"use client";

export default function PropertiesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold tracking-wide text-neutral-500">
            MI CASA PERÚ
          </p>
          <h1 className="mt-2 text-xl font-semibold text-neutral-900">
            No pudimos cargar las propiedades
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Intenta nuevamente. Si el problema persiste, revisa conexión a Supabase
            o políticas RLS.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800"
            >
              Reintentar
            </button>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
            >
              Abrir Supabase
            </a>
          </div>

          <details className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-neutral-900">
              Detalles técnicos
            </summary>
            <pre className="mt-3 overflow-auto text-xs text-neutral-700">
{error?.message}
            </pre>
          </details>
        </div>
      </section>
    </main>
  );
}