import { Building2, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";
import { directionsUrl } from "@/lib/geo";
import type { Venue } from "@/lib/types";

// Paleta estable por sede (no depende del mapa) para diferenciar los bloques a simple vista.
const PALETTE = [
  "from-primary/70 to-primary/30",
  "from-secondary/80 to-secondary/40",
  "from-amber-500/70 to-amber-500/30",
];

function paletteFor(id: string) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

/** Bloque fijo de sede: foto (si existe) o ilustración, nombre, dirección y "Cómo llegar" funcional. */
export function VenueCard({ venue }: { venue: Venue }) {
  return (
    <Card className="overflow-hidden p-0">
      <div
        className={`flex h-28 items-center justify-center bg-gradient-to-br ${paletteFor(venue.id)}`}
      >
        {venue.photo_url ? (
          <img src={venue.photo_url} alt={venue.name} className="h-full w-full object-cover" />
        ) : (
          <Building2 className="h-10 w-10 text-primary-foreground/90" />
        )}
      </div>
      <div className="space-y-2 p-3">
        <div>
          <div className="truncate text-sm font-bold">{venue.name}</div>
          <div className="truncate text-xs text-muted-foreground">{venue.address}</div>
          <div className="text-xs text-muted-foreground">{venue.city}</div>
        </div>
        <a
          href={directionsUrl(venue)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-bold uppercase tracking-wide text-primary-foreground hover:bg-primary/90"
        >
          <Navigation className="h-3.5 w-3.5" /> Cómo llegar
        </a>
      </div>
    </Card>
  );
}
