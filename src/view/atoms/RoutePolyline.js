import { Polyline } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";

export default function RoutePolyline({ route }) {
  const navigate = useNavigate();
  const { selectedRoute, selectedHalt, currentLatLng } = useData();
  const isNotSelectedRoute = selectedRoute && selectedRoute.id !== route.id;
  const isNotHaveSelectedHalt = selectedHalt && !route.hasHalt(selectedHalt);
  const isNotSelected = isNotSelectedRoute || isNotHaveSelectedHalt;

  const opacity = isNotSelected ? 0.05 : 1.0;
  return (
    <Polyline
      key={`${route.routeNum}-${route.direction}`}
      positions={route.latLngList.map((latLng) => latLng.toArray())}
      color={route.getColor()}
      weight={3}
      opacity={opacity}
      eventHandlers={{
        click: () => {
          navigate(
            `/${currentLatLng.id}/route/${encodeURIComponent(route.id)}`,
          );
        },
      }}
    />
  );
}
