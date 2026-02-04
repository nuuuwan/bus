import { Polyline } from "react-leaflet";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";

export default function RoutePolyline({ route }) {
  const params = useParams();
  const navigate = useNavigate();
  const { selectedRoute } = useData();
  const isNotSelected = selectedRoute && selectedRoute?.id !== route.id;

  let color = route.getColor();
  let opacity = 1.0;
  if (isNotSelected) {
    color = "white";
    opacity = 0.25;
  }

  return (
    <Polyline
      key={`${route.routeNum}-${route.direction}`}
      positions={route.latLngList.map((latLng) => latLng.toArray())}
      color={color}
      weight={3}
      opacity={opacity}
      eventHandlers={{
        click: () => {
          const latLng = params.latLngId || "";
          navigate(`/${latLng}/route/${encodeURIComponent(route.id)}`);
        },
      }}
    />
  );
}
