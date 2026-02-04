import { Marker } from "react-leaflet";
import { useParams, useNavigate } from "react-router-dom";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import PlaceIcon from "@mui/icons-material/Place";

export default function HaltMarker({ halt, isSelected }) {
  const params = useParams();
  const navigate = useNavigate();
  const selectedHaltId = params.haltId;
  const isOnHaltPage = !!selectedHaltId;

  // Create custom icon for halts
  // If on halt page: selected = black, others = white
  // If NOT on halt page: all = black
  let color = "black"; // Default: black for all halts
  if (isOnHaltPage && !isSelected) {
    color = "white"; // Only show white for non-selected when on halt page
  }

  const haltIcon = L.divIcon({
    className: "custom-halt-icon",
    html: renderToStaticMarkup(
      <PlaceIcon style={{ color, fontSize: "32px" }} />,
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
