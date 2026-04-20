import { renderToStaticMarkup } from "react-dom/server";
import { Marker } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { useData } from "../../nonview/contexts/DataContext";

function buildHaltIcon(color) {
  const iconHtml = renderToStaticMarkup(
    <StopCircleIcon style={{ color, fontSize: 20, display: "block" }} />,
  );
  return L.divIcon({
    html: `<div style="background:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.4)">${iconHtml}</div>`,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export default function HaltMarker({ halt }) {
  const navigate = useNavigate();
  const { selectedHalt, selectedRoute, routes, currentLatLng } = useData();

  const isNotOnSelectedRoute = selectedRoute && !selectedRoute.hasHalt(halt);
  const isNotSelectedHalt = selectedHalt && selectedHalt.id !== halt.id;
  const isNotSelected = isNotOnSelectedRoute || isNotSelectedHalt;

  if (isNotSelected) {
    return null;
  }

  const routesWithHalt = routes.filter((route) => route.hasHalt(halt));
  const colors = routesWithHalt.map((route) => route.getColor());
  const uniqueColors = [...new Set(colors)];
  const color = uniqueColors.length === 1 ? uniqueColors[0] : "gray";

  if (!halt.latLng) return null;

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
