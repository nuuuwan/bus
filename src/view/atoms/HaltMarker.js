import { renderToStaticMarkup } from "react-dom/server";
import { Marker } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { useData } from "../../nonview/contexts/DataContext";

function buildHaltIcon(color) {
  const iconHtml = renderToStaticMarkup(
    <StopCircleIcon style={{ color, fontSize: 12, display: "block" }} />,
  );
  return L.divIcon({
    html: `<div style="background:white;border-radius:50%;width:14px;height:14px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,0.4)">${iconHtml}</div>`,
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export default function HaltMarker({ halt }) {
  const navigate = useNavigate();
  const { selectedHalt, selectedRoute, selectedBus, routes, currentLatLng } = useData();

  if (!halt.latLng) return null;

  const routesWithHalt = routes.filter((route) => route.hasHalt(halt));
  const colors = routesWithHalt.map((route) => route.getColor());
  const uniqueColors = [...new Set(colors)];
  const routeColor = uniqueColors.length === 1 ? uniqueColors[0] : "gray";

  // Grey out when a different halt or a bus (not on a route serving this halt) is selected
  const hasBusSelection = !!selectedBus;
  const busServesHalt = hasBusSelection && selectedBus.route.hasHalt(halt);
  const hasHaltSelection = !!selectedHalt;
  const hasRouteSelection = !!selectedRoute;

  const isDimmed =
    (hasHaltSelection && selectedHalt.id !== halt.id) ||
    (hasRouteSelection && !selectedRoute.hasHalt(halt)) ||
    (hasBusSelection && !busServesHalt);

  const color = isDimmed ? "#ccc" : routeColor;

  return (
    <Marker
      position={[halt.latLng.lat, halt.latLng.lng]}
      icon={buildHaltIcon(color)}
      eventHandlers={{
        click: () => {
          navigate(`/${currentLatLng.id}/halt/${encodeURIComponent(halt.id)}`);
        },
      }}
    />
  );
}
