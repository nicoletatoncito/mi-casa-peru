// src/lib/properties.ts
import type { Listing } from "./db/properties";
import { getProperties, getPropertyById } from "./db/properties";

/**
 * Re-exports para mantener imports antiguos funcionando.
 * El tipo real en el DB layer es Listing.
 */
export type { Listing };
export { getProperties, getPropertyById };

/** Alias legacy */
export const fetchAllProperties = getProperties;
export const fetchPropertyById = getPropertyById;