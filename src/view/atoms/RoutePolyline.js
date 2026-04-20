import { Polyline } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";

const NEUTRAL_COLOR = "#aaa";

export default function RoutePolyline({ route }) {
  const navigate = useNavigate();
  const { selectedRoute, selectedHalt, currentLatLng } = useData();

  const isSelected =
    (!selectedRoute && !selectedHalt) ||
    (selectedRoute && selectedRoute.id === route.id) ||
    (selectedHalt && route.hasHalt(selectedHalt));

  const color = isSelected ? route.getColor() : NEUTRAL_COLOR;
  const weight = isSelected ? 4 : 2;
  const opacity = isSelected ? 1 : 0.4;

  return (
    <Polyline
      key={`${route.routeNum}-${route.direction}`}
      positions={route.latLngList.map((latLng) => latLng.toArray())}
      color={color}
      weight={weight}
      opacity={opacity}
      eventHandlers={{
        click: () => {
          if (currentLatLng) {
            navigate(
              `/${currentLatLng.id}/route/${encodeURIComponent(route.id)}`,
            );
          }
        },
      }}
    />
  );
}
