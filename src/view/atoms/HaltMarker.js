import { CircleMarker } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";

export default function HaltMarker({ halt }) {
  const RADIUS = 6;
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

  return (
    <CircleMarker
      center={halt.latLng ? [halt.latLng.lat, halt.latLng.lng] : null}
      radius={RADIUS}
      fillColor="white"
      fillOpacity={1}
      color={color}
      weight={RADIUS / 2}
      opacity={1}
      eventHandlers={{
        click: () => {
          navigate(`/${currentLatLng.id}/halt/${encodeURIComponent(halt.id)}`);
        },
      }}
    />
  );
}
