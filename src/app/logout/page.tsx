"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function run() {
      const supabase = createBrowserSupabase();
      await supabase.auth.signOut();
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    }

    void run();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-4 text-sm text-neutral-700 shadow-sm">
        Cerrando sesión...
      </div>
    </main>
  );
}

