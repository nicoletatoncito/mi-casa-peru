"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

export type MapItem = {
  id: string;
  title: string;
  city: string;
  district: string;
  address: string;
  pricePen: number;
  operation: string;
  type: string;
  lat: number;
  lng: number;
};

function formatPEN(value: number) {
  return value.toLocaleString("es-PE");
}

// Bounds “Perú + un poco” para que el mapa siempre se vea correcto
const PERU_BOUNDS = L.latLngBounds(
  L.latLng(-18.5, -81.6),
  L.latLng(-0.0, -68.6)
);

function FitPins({ items }: { items: MapItem[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const pins = items
      .filter((i) => Number.isFinite(i.lat) && Number.isFinite(i.lng))
      .map((i) => L.latLng(i.lat, i.lng));

    if (pins.length >= 2) {
      map.fitBounds(L.latLngBounds(pins).pad(0.2), { animate: true });
      return;
    }

    if (pins.length === 1) {
      map.setView(pins[0], 12, { animate: true });
      return;
    }

    map.fitBounds(PERU_BOUNDS.pad(0.08), { animate: true });
  }, [items, map]);

  return null;
}

export default function PeruMap({
  items,
  height = 520,
}: {
  items: MapItem[];
  height?: number;
}) {
  const icon = useMemo(() => {
    // Pin nítido + sombra (pro)
    return new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -36],
      shadowSize: [41, 41],
    });
  }, []);

  return (
    <div
      className="overflow-hidden rounded-3xl border bg-white shadow-[0_25px_60px_-35px_rgba(0,0,0,.45)]"
      style={{ height }}
    >
      <MapContainer
        bounds={PERU_BOUNDS}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
        zoomControl
        maxBounds={PERU_BOUNDS.pad(0.2)}
        maxBoundsViscosity={0.6}
      >
        {/* Tiles premium sin API key */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <FitPins items={items} />

        {items.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={icon}>
            <Popup>
              <div className="space-y-1">
                <div className="text-sm font-semibold">{p.title}</div>
                <div className="text-xs opacity-80">
                  {p.district}, {p.city}
                </div>
                <div className="text-xs opacity-70">{p.address}</div>
                <div className="pt-1 text-sm font-bold">
                  S/ {formatPEN(p.pricePen)}
                </div>
                <div className="text-[11px] opacity-70">
                  {p.operation} • {p.type}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}