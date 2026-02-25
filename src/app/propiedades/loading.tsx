// src/app/propiedades/loading.tsx
function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="h-44 w-full animate-pulse bg-neutral-200" />
      <div className="p-4">
        <div className="h-3 w-3/5 animate-pulse rounded bg-neutral-200" />
        <div className="mt-2 h-3 w-2/5 animate-pulse rounded bg-neutral-200" />
        <div className="mt-4 h-3 w-4/5 animate-pulse rounded bg-neutral-200" />
        <div className="mt-3 flex items-center justify-between">
          <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
          <div className="h-3 w-8 animate-pulse rounded bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}

export default function PropertiesLoading() {
  return (
    <main className="min-h-screen bg-neutral-50">
      {/* header */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
          <div className="mt-3 h-7 w-48 animate-pulse rounded bg-neutral-200" />
          <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-neutral-200" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* map */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="lg:sticky lg:top-4">
              <div className="h-[420px] w-full animate-pulse rounded-3xl border border-neutral-200 bg-neutral-200 lg:h-[calc(100vh-210px)]" />
              <div className="mt-2 h-3 w-64 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>

          {/* list */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <div className="space-y-4">
              {/* filters skeleton */}
              <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-28 animate-pulse rounded bg-neutral-200" />
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <div className="h-10 animate-pulse rounded-2xl bg-neutral-200" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 animate-pulse rounded-2xl bg-neutral-200" />
                    <div className="h-10 animate-pulse rounded-2xl bg-neutral-200" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 animate-pulse rounded-2xl bg-neutral-200" />
                    <div className="h-10 animate-pulse rounded-2xl bg-neutral-200" />
                  </div>
                </div>
              </div>

              {/* cards skeleton */}
              <div className="space-y-3">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}