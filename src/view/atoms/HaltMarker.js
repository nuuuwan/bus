import { Marker } from "react-leaflet";
import { useParams, useNavigate } from "react-router-dom";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import PlaceIcon from "@mui/icons-material/Place";
import { useData } from "../../nonview/contexts/DataContext";

export default function HaltMarker({ halt }) {
  const params = useParams();
  const navigate = useNavigate();
  const { selectedHalt } = useData();
  const isNotSelected = selectedHalt && selectedHalt.id !== halt.id;

  const opacity = isNotSelected ? 0.25 : 1.0;

  const haltIcon = L.divIcon({
    className: "custom-halt-icon",
    html: renderToStaticMarkup(
      <PlaceIcon style={{ color: "black", fontSize: "32px", opacity }} />,
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
          const latLng = params.latLngId || "";
          navigate(`/${latLng}/halt/${encodeURIComponent(halt.id)}`);
        },
      }}
    />
  );
}
