// src/app/propiedades/loading.tsx
export default function Loading() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
          <div className="mt-3 h-7 w-56 animate-pulse rounded bg-neutral-200" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-neutral-200" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* MAP skeleton */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="lg:sticky lg:top-4">
              <div className="h-[420px] w-full animate-pulse rounded-3xl border border-neutral-200 bg-white lg:h-[calc(100vh-210px)]" />
              <div className="mt-2 h-3 w-44 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>

          {/* LIST skeleton */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <div className="space-y-4">
              <div className="h-16 animate-pulse rounded-3xl border border-neutral-200 bg-white" />

              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
                  >
                    <div className="h-44 animate-pulse bg-neutral-200" />
                    <div className="p-4">
                      <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-200" />
                      <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
                      <div className="mt-4 h-3 w-1/3 animate-pulse rounded bg-neutral-200" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-12 animate-pulse rounded-2xl border border-neutral-200 bg-white" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}