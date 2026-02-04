import { Polyline } from "react-leaflet";
import { useParams, useNavigate } from "react-router-dom";

export default function RoutePolyline({ route }) {
  const params = useParams();
  const navigate = useNavigate();

  return (
    <Polyline
      key={`${route.routeNum}-${route.direction}`}
      positions={route.latLngList.map((latLng) => latLng.toArray())}
      color={route.getColor()}
      weight={3}
      opacity={1}
      eventHandlers={{
        click: () => {
          const latLng = params.latLngId || "";
          navigate(`/${latLng}/route/${encodeURIComponent(route.id)}`);
        },
      }}
    />
  );
}
