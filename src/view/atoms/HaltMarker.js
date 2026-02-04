import { Marker } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import PlaceIcon from "@mui/icons-material/Place";
import { useData } from "../../nonview/contexts/DataContext";

export default function HaltMarker({ halt }) {
  const navigate = useNavigate();
  const { selectedHalt, selectedRoute, routes, currentLatLng } = useData();

  const isNotOnSelectedRoute = selectedRoute && !selectedRoute.hasHalt(halt);
  const isNotSelectedHalt = selectedHalt && selectedHalt.id !== halt.id;
  const isNotSelected = isNotOnSelectedRoute || isNotSelectedHalt;

  const routesWithHalt = routes.filter((route) => route.hasHalt(halt));
  let color = "black";
  if (routesWithHalt.length === 1) {
    color = routesWithHalt[0].getColor();
  }

  const opacity = isNotSelected ? 0.1 : 1.0;

  const haltIcon = L.divIcon({
    className: "custom-halt-icon",
    html: renderToStaticMarkup(
      <PlaceIcon style={{ color, fontSize: "32px", opacity }} />,
    ),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return (
    <Marker
      key={halt.name}
      position={halt.latLng ? [halt.latLng.lat, halt.latLng.lng] : null}
      icon={haltIcon}
      eventHandlers={{
        click: () => {
          navigate(`/${currentLatLng.id}/halt/${encodeURIComponent(halt.id)}`);
        },
      }}
    />
  );
}
