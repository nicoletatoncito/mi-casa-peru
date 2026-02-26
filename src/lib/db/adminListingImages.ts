// src/lib/db/adminListingImages.ts
import "server-only";
import { createServerSupabaseAdmin } from "@/lib/supabase";

export type ListingImage = {
  id: string;
  listing_id: string;
  path: string;
  is_cover: boolean;
  sort_order: number;
  created_at: string;
};

const SELECT = "id,listing_id,path,is_cover,sort_order,created_at";

export async function adminListListingImages(listingId: string): Promise<ListingImage[]> {
  const supabase = createServerSupabaseAdmin();

  const { data, error } = await supabase
    .from("listing_images")
    .select(SELECT)
    .eq("listing_id", listingId)
    .order("is_cover", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("adminListListingImages error:", error);
    return [];
  }

  return (data ?? []) as ListingImage[];
}