import { renderToStaticMarkup } from "react-dom/server";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import { useClock } from "../../nonview/contexts/ClockContext";

function buildBusIcon(color, heading) {
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
    html: `<div style="background:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.5)">${iconHtml}</div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export default function BusMarker({ bus }) {
  const now = useClock();
  const latLng = bus.latLngAt(now);

  if (!latLng) return null;

  const icon = buildBusIcon(bus.route.getColor(), bus.headingAt(now));

  return (
    <Marker position={[latLng.lat, latLng.lng]} icon={icon}>
      <Tooltip direction="top" offset={[0, -12]} opacity={0.9}>
        {bus.route.displayName}
      </Tooltip>
    </Marker>
  );
}
