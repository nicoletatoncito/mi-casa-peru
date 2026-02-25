// src/components/maps/PeruMap.tsx
"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

type Pin = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  priceLabel: string;
  subtitle?: string;
  href: string;
  featured?: boolean;
  verified?: boolean;
};

type Props = {
  pins: Pin[];
  fallbackCenter?: [number, number];
  fallbackZoom?: number;
};

const DEFAULT_CENTER: [number, number] = [-9.19, -75.0152];
const DEFAULT_ZOOM = 5;

function useFixLeafletIcons() {
  useEffect(() => {
    // @ts-expect-error private
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);
}

function FitBounds({ pins }: { pins: Pin[] }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length < 2) return;
    const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number])).pad(0.18);
    map.fitBounds(bounds, { animate: true });
  }, [map, pins]);
  return null;
}

function priceMarkerIcon(priceLabel: string, opts?: { featured?: boolean; verified?: boolean }) {
  const featured = !!opts?.featured;
  const verified = !!opts?.verified;

  // Sobrio y “caro”: pill con borde, sombra suave, no emojis.
  const html = `
    <div class="mcp-pin ${featured ? "mcp-pin--featured" : ""}">
      <div class="mcp-pin__pill">
        <span class="mcp-pin__price">${escapeHtml(priceLabel)}</span>
        ${verified ? `<span class="mcp-pin__dot" aria-hidden="true"></span>` : ""}
      </div>
      <div class="mcp-pin__tail"></div>
    </div>
  `;

  return L.divIcon({
    className: "mcp-divicon",
    html,
    iconSize: [1, 1],
    iconAnchor: [0, 0],
    popupAnchor: [0, -18],
  });
}

function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function PeruMap({
  pins,
  fallbackCenter = DEFAULT_CENTER,
  fallbackZoom = DEFAULT_ZOOM,
}: Props) {
  useFixLeafletIcons();

  const center = useMemo<[number, number]>(() => {
    if (pins.length === 1) return [pins[0].lat, pins[0].lng];
    return fallbackCenter;
  }, [pins, fallbackCenter]);

  const zoom = pins.length === 1 ? 13 : fallbackZoom;

  return (
    <div className="relative">
      {/* estilos del marker (scoped aquí, sin librerías extra) */}
      <style>{`
        .mcp-divicon { background: transparent; border: none; }
        .mcp-pin { position: relative; transform: translate(-50%, -100%); }
        .mcp-pin__pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(23,23,23,0.12);
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(8px);
          box-shadow: 0 10px 26px -18px rgba(0,0,0,0.55);
          white-space: nowrap;
        }
        .mcp-pin__price {
          font: 600 12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto;
          color: rgba(17,17,17,0.92);
          letter-spacing: -0.01em;
        }
        .mcp-pin__dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: rgba(16,185,129,0.95);
          box-shadow: 0 0 0 3px rgba(16,185,129,0.18);
        }
        .mcp-pin__tail {
          position: absolute;
          left: 50%;
          top: 100%;
          width: 10px;
          height: 10px;
          transform: translate(-50%, -50%) rotate(45deg);
          background: rgba(255,255,255,0.92);
          border-right: 1px solid rgba(23,23,23,0.10);
          border-bottom: 1px solid rgba(23,23,23,0.10);
          box-shadow: 0 10px 26px -18px rgba(0,0,0,0.55);
        }
        .mcp-pin--featured .mcp-pin__pill {
          border-color: rgba(17,17,17,0.18);
          box-shadow: 0 12px 34px -20px rgba(0,0,0,0.7);
        }
      `}</style>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        className="h-[420px] w-full lg:h-[calc(100vh-210px)]"
      >
        {/* Tiles sobrios tipo “producto real” */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {pins.length > 1 ? <FitBounds pins={pins} /> : null}

        {pins.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={priceMarkerIcon(p.priceLabel, { featured: p.featured, verified: p.verified })}
          >
            <Popup closeButton>
              <div className="min-w-[240px] max-w-[280px]">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  {p.priceLabel}
                </div>
                <div className="mt-1 text-sm font-semibold text-neutral-900">
                  {p.title}
                </div>
                {p.subtitle ? (
                  <div className="mt-1 text-xs text-neutral-600">{p.subtitle}</div>
                ) : null}

                <a
                  href={p.href}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800"
                >
                  Ver detalle
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}