import { renderToStaticMarkup } from "react-dom/server";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import { useClock } from "../../nonview/contexts/ClockContext";

function buildBusIcon(color, heading, label) {
  const iconHtml = renderToStaticMarkup(
    <AirportShuttleIcon
      style={{
        color,
        fontSize: 24,
        transform: `rotate(${heading - 90}deg)`,
        display: "block",
      }}
    />,
  );
  return L.divIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px">
      <div style="background:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.5)">${iconHtml}</div>
      <div style="background:${color};color:white;font-size:9px;font-weight:bold;padding:1px 4px;border-radius:3px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.4);line-height:1.2">${label}</div>
    </div>`,
    className: "",
    iconSize: [28, 42],
    iconAnchor: [14, 14],
  });
}

export default function BusMarker({ bus }) {
  const now = useClock();
  const latLng = bus.latLngAt(now);

  if (!latLng) return null;

  const icon = buildBusIcon(bus.route.getColor(), bus.headingAt(now), bus.route.shortLabel);

  return (
    <Marker position={[latLng.lat, latLng.lng]} icon={icon}>
      <Tooltip direction="top" offset={[0, -12]} opacity={0.9}>
        {bus.route.displayName}
      </Tooltip>
    </Marker>
  );
}
