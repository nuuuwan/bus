import { Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import Distance from "../atoms/Distance";

export default function HaltLink({ halt }) {
  const location = useLocation();
  const { currentLatLng } = useData();

  // Extract latLng from current pathname
  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  // Calculate distance if currentLatLng is available
  const distanceKm =
    currentLatLng && halt.latLng ? currentLatLng.distanceTo(halt.latLng) : null;

  return (
    <Link
      to={`/${latLng}/halt/${encodeURIComponent(halt.id)}`}
      style={{ textDecoration: "none", width: "100%", color: "inherit" }}
    >
      <Box display="flex" alignItems="center" gap={1} sx={{}}>
        <Typography variant="body1">{halt.displayName}</Typography>
        <Distance distanceKm={distanceKm} />
      </Box>
    </Link>
  );
}
