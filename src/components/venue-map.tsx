import { lazy, Suspense, useEffect, useState } from "react";
import type { Venue } from "@/lib/types";

const InnerMap = lazy(() => import("./venue-map-inner"));

export function VenueMap({ venues, activeId }: { venues: Venue[]; activeId?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className="h-72 w-full animate-pulse rounded-lg border bg-muted sm:h-96" />;
  }
  return (
    <Suspense fallback={<div className="h-72 w-full animate-pulse rounded-lg border bg-muted sm:h-96" />}>
      <InnerMap venues={venues} activeId={activeId} />
    </Suspense>
  );
}

export function directionsUrl(v: Venue) {
  return `https://www.google.com/maps/dir/?api=1&destination=${v.coordinates.lat},${v.coordinates.lng}`;
}