import { renderToStaticMarkup } from "react-dom/server";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useClock } from "../../nonview/contexts/ClockContext";
import { useData } from "../../nonview/contexts/DataContext";
import { useNavigate } from "react-router-dom";

function buildBusIcon(color, heading, label, approachArrow) {
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
  const arrowHtml =
    approachArrow === "up"
      ? renderToStaticMarkup(
          <ArrowUpwardIcon style={{ color: "#4caf50", fontSize: 12 }} />,
        )
      : approachArrow === "down"
        ? renderToStaticMarkup(
            <ArrowDownwardIcon style={{ color: "#f44336", fontSize: 12 }} />,
          )
        : "";
  return L.divIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px">
      <div style="background:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.5)">${iconHtml}</div>
      <div style="background:${color};color:white;font-size:9px;font-weight:bold;padding:1px 4px;border-radius:3px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.4);line-height:1.2;display:flex;align-items:center;gap:2px">${arrowHtml}${label}</div>
    </div>`,
    className: "",
    iconSize: [28, 42],
    iconAnchor: [14, 14],
  });
}

export default function BusMarker({ bus }) {
  const now = useClock();
  const { currentLatLng, selectedBus } = useData();
  const navigate = useNavigate();
  const latLng = bus.latLngAt(now);

  if (!latLng) return null;

  const isSelected = !selectedBus || selectedBus.id === bus.id;
  const color = isSelected ? bus.route.getColor() : "#aaa";

  const icon = buildBusIcon(
    color,
    bus.headingAt(now),
    `${bus.route.shortLabel} · ${bus.numberPlate}`,
    null,
  );

  return (
    <Marker
      position={[latLng.lat, latLng.lng]}
      icon={icon}
      eventHandlers={{
        click: () => {
          const base = currentLatLng ? currentLatLng.id : "0,0";
          navigate(`/${base}/bus/${encodeURIComponent(bus.id)}`);
        },
      }}
    >
      <Tooltip direction="top" offset={[0, -12]} opacity={0.9}>
        {bus.route.displayName} · {bus.numberPlate}
      </Tooltip>
    </Marker>
  );
}
