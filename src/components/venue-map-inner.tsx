import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { Venue } from "@/lib/types";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14);
  }, [lat, lng, map]);
  return null;
}

export default function VenueMapInner({
  venues,
  activeId,
}: {
  venues: Venue[];
  activeId?: string;
}) {
  const active = venues.find((v) => v.id === activeId) ?? venues[0];
  if (!active) return null;
  return (
    <div className="h-72 w-full overflow-hidden rounded-lg border sm:h-96">
      <MapContainer
        center={[active.coordinates.lat, active.coordinates.lng]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter lat={active.coordinates.lat} lng={active.coordinates.lng} />
        {venues.map((v) => (
          <Marker key={v.id} position={[v.coordinates.lat, v.coordinates.lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-bold">{v.name}</div>
                <div className="text-xs">{v.address}</div>
                <a
                  className="mt-1 inline-block text-blue-600 underline"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${v.coordinates.lat},${v.coordinates.lng}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Cómo llegar
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}