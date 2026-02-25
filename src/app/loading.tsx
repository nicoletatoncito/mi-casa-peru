// src/app/loading.tsx
export default function GlobalLoading() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-6 w-44 animate-pulse rounded-lg bg-neutral-200" />
        <div className="mt-3 h-10 w-[520px] max-w-full animate-pulse rounded-2xl bg-neutral-200" />
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="h-[420px] w-full animate-pulse rounded-3xl bg-neutral-200 lg:h-[calc(100vh-210px)]" />
          </div>
          <div className="lg:col-span-5 space-y-3">
            <div className="h-40 animate-pulse rounded-3xl bg-neutral-200" />
            <div className="h-64 animate-pulse rounded-3xl bg-neutral-200" />
          </div>
        </div>
      </div>
    </main>
  );
}