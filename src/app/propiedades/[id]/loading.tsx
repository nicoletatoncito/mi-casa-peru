// src/app/propiedades/[id]/loading.tsx
export default function PropertyDetailLoading() {
  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header skeleton */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="h-4 w-40 animate-pulse rounded bg-neutral-200" />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="h-7 w-[520px] max-w-full animate-pulse rounded bg-neutral-200" />
              <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-neutral-200" />
              <div className="mt-3 h-3 w-[420px] max-w-full animate-pulse rounded bg-neutral-200" />
            </div>
            <div className="shrink-0 text-right">
              <div className="h-6 w-40 animate-pulse rounded bg-neutral-200" />
              <div className="mt-2 h-3 w-24 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        </div>
      </section>

      {/* Body skeleton */}
      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Left column */}
          <div className="space-y-4 lg:col-span-8">
            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
              <div className="h-64 w-full animate-pulse bg-neutral-200" />
              <div className="p-5">
                <div className="h-4 w-28 animate-pulse rounded bg-neutral-200" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-neutral-200" />
                  <div className="h-3 w-11/12 animate-pulse rounded bg-neutral-200" />
                  <div className="h-3 w-10/12 animate-pulse rounded bg-neutral-200" />
                  <div className="h-3 w-9/12 animate-pulse rounded bg-neutral-200" />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
              <div className="mt-3 h-3 w-64 animate-pulse rounded bg-neutral-200" />
              <div className="mt-2 h-3 w-96 max-w-full animate-pulse rounded bg-neutral-200" />
            </div>
          </div>

          {/* Right column */}
          <aside className="lg:col-span-4">
            <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
              <div className="mt-5 space-y-3">
                <Row />
                <Row />
                <Row />
                <Row />
                <Row />
                <Row />
              </div>

              <div className="mt-6 space-y-2">
                <div className="h-11 w-full animate-pulse rounded-2xl bg-neutral-200" />
                <div className="h-11 w-full animate-pulse rounded-2xl bg-neutral-200" />
                <div className="pt-2">
                  <div className="h-3 w-44 animate-pulse rounded bg-neutral-200" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Row() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
      <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
    </div>
  );
}