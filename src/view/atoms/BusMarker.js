import { renderToStaticMarkup } from "react-dom/server";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import { useClock } from "../../nonview/contexts/ClockContext";

function buildBusIcon(color) {
  const iconHtml = renderToStaticMarkup(
    <DirectionsBusIcon style={{ color, fontSize: 24 }} />,
  );
  return L.divIcon({
    html: `<div style="filter:drop-shadow(0 1px 3px rgba(0,0,0,0.6));line-height:0">${iconHtml}</div>`,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export default function BusMarker({ bus }) {
  const now = useClock();
  const latLng = bus.latLngAt(now);

  if (!latLng) return null;

  const icon = buildBusIcon(bus.route.getColor());

  return (
    <Marker position={[latLng.lat, latLng.lng]} icon={icon}>
      <Tooltip direction="top" offset={[0, -12]} opacity={0.9}>
        {bus.route.displayName}
      </Tooltip>
    </Marker>
  );
}
