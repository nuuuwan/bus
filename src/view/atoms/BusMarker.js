import { useEffect, useState } from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";

/**
 * Renders a single animated Bus on the map.
 * Position is recalculated every BUS_TICK_MS milliseconds.
 */
const BUS_TICK_MS = 5_000; // refresh every 5 s

function buildBusIcon(color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" font-size="12" font-family="sans-serif" fill="white">🚌</text>
    </svg>`.trim();

  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export default function BusMarker({ bus }) {
  const [latLng, setLatLng] = useState(() => bus.latLngAt(Date.now()));

  useEffect(() => {
    const tick = () => setLatLng(bus.latLngAt(Date.now()));

    const timer = setInterval(tick, BUS_TICK_MS);
    return () => clearInterval(timer);
  }, [bus]);

  if (!latLng) return null;

  const icon = buildBusIcon(bus.route.getColor());

  return (
    <Marker position={[latLng.lat, latLng.lng]} icon={icon}>
      <Tooltip
        direction="top"
        offset={[0, -12]}
        opacity={0.9}
        permanent={false}
      >
        {bus.route.displayName}
      </Tooltip>
    </Marker>
  );
}
