import type { Venue } from "./types";

export function directionsUrl(venue: Venue): string {
  // Leemos la latitud y longitud tanto si vienen planas de Supabase (lat/lng) como si vienen en un objeto (coordinates)
  const lat = (venue as any).lat ?? venue.coordinates?.lat ?? 0;
  const lng = (venue as any).lng ?? venue.coordinates?.lng ?? 0;
  
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}