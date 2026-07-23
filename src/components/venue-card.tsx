import { Navigation, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { directionsUrl } from "@/lib/geo";
import type { Venue } from "@/lib/types";

export function VenueCard({ venue }: { venue: Venue }) {
  // Verificamos si la sede tiene foto. Si no tiene, usamos un fondo gris por defecto.
  const hasImage = Boolean(venue.image_url);

  return (
    <Card className="flex h-full flex-col overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      {/* ZONA DE LA FOTO */}
      <div
        className={`relative flex h-36 items-center justify-center ${!hasImage ? "bg-muted" : ""}`}
        style={
          hasImage
            ? {
                backgroundImage: `url(${venue.image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {/* Filtro oscuro sobre la foto para que no desentone con el diseño general */}
        {hasImage && <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />}
        
        {/* Si no hay foto, mostramos el ícono del edificio en grande */}
        {!hasImage && <Building2 className="h-10 w-10 text-muted-foreground/30" />}
      </div>

      {/* ZONA DE TEXTO Y BOTÓN */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="text-sm font-black leading-tight tracking-tight text-foreground">
            {venue.name}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {venue.address}
            <br />
            {venue.city}
          </p>
        </div>
        <div className="mt-4">
          <Button asChild className="w-full font-bold" size="sm">
            <a href={directionsUrl(venue)} target="_blank" rel="noreferrer">
              <Navigation className="mr-2 h-4 w-4" /> Cómo llegar
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}