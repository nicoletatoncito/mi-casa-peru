// src/lib/properties.ts
import type { Property } from "./db/properties";
import { getProperties, getPropertyById } from "./db/properties";

/**
 * Re-exports para mantener imports antiguos funcionando:
 * - si en tu código existe `import { fetchAllProperties } from "@/lib/properties"`
 * - o `import { getProperties } from "@/lib/properties"`
 */

export type { Property };

export { getProperties, getPropertyById };

/**
 * Alias legacy (por si tu app aún llama este nombre)
 */
export const fetchAllProperties = getProperties;
export const fetchPropertyById = getPropertyById;