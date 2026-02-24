import { supabase } from "@/lib/supabase";

export type Property = {
  id: string;

  title: string;
  price_pen: number;

  city: string;
  district: string;
  address: string;

  type: string;
  operation: string;

  area_m2: number;

  beds: number | null;
  baths: number | null;
  parking: number | null;

  image_url: string | null;
  description: string | null;

  featured: boolean;
  verified: boolean;

  created_at: string;

  // IMPORTANT: para el mapa
  lat: number | null;
  lng: number | null;
};

function mapRow(row: any): Property {
  return {
    id: String(row.id),

    title: row.title ?? "",
    price_pen: Number(row.price_pen ?? 0),

    city: row.city ?? "",
    district: row.district ?? "",
    address: row.address ?? "",

    type: row.type ?? "",
    operation: row.operation ?? "",

    area_m2: Number(row.area_m2 ?? 0),

    beds: row.beds ?? null,
    baths: row.baths ?? null,
    parking: row.parking ?? null,

    image_url: row.image_url ?? null,
    description: row.description ?? null,

    featured: Boolean(row.featured),
    verified: Boolean(row.verified),

    created_at: row.created_at ?? "",

    lat: row.lat ?? null,
    lng: row.lng ?? null,
  };
}

export async function fetchAllProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(
      `
      id,
      title,
      price_pen,
      city,
      district,
      address,
      type,
      operation,
      area_m2,
      beds,
      baths,
      parking,
      image_url,
      description,
      featured,
      verified,
      created_at,
      lat,
      lng
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchAllProperties error:", error.message);
    return [];
  }

  return (data ?? []).map(mapRow);
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select(
      `
      id,
      title,
      price_pen,
      city,
      district,
      address,
      type,
      operation,
      area_m2,
      beds,
      baths,
      parking,
      image_url,
      description,
      featured,
      verified,
      created_at,
      lat,
      lng
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("fetchPropertyById error:", error.message);
    return null;
  }

  if (!data) return null;
  return mapRow(data);
}