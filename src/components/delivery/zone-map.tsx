"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

// Kyiv centre (default). Replace with your real depot location.
const CENTRE: [number, number] = [50.4501, 30.5234];
// Approximate delivery radii in metres.
const ZONES = [
  { radius: 3000, color: "#10B981", label: "Free zone" }, // 3 km
  { radius: 6000, color: "#F26A1A", label: "Standard zone" }, // 6 km
  { radius: 9000, color: "#B33D0A", label: "Extended zone" }, // 9 km
];

export function ZoneMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let map: import("leaflet").Map | null = null;
    let cancelled = false;

    void (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, {
        center: CENTRE,
        zoom: 12,
        scrollWheelZoom: false,
      });

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }
      ).addTo(map);

      // Concentric delivery zones — drawn outer-first so the inner ones sit on top.
      for (const zone of [...ZONES].reverse()) {
        L.circle(CENTRE, {
          radius: zone.radius,
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.08,
          weight: 2,
          opacity: 0.55,
        }).addTo(map);
      }

      // Restaurant pin
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#F26A1A,#B33D0A);border:3px solid #FFF8F1;box-shadow:0 4px 16px rgba(242,106,26,0.5);display:flex;align-items:center;justify-content:center;color:#FFF8F1;font-weight:bold;font-size:18px;">🍕</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      L.marker(CENTRE, { icon }).addTo(map).bindPopup("BulloniPizza HQ");
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="h-[420px] md:h-[480px] w-full rounded-3xl overflow-hidden border border-border z-0"
      />
      {/* Legend */}
      <div className="absolute top-3 right-3 z-[400] glass rounded-2xl p-3 border border-border text-xs space-y-1.5 max-w-[180px]">
        {ZONES.map((z) => (
          <div key={z.radius} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full shrink-0 border"
              style={{ background: z.color + "33", borderColor: z.color }}
            />
            <span>
              {z.label} · {z.radius / 1000} km
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
