import { Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import Distance from "../atoms/Distance";
import RouteIcon from "../atoms/RouteIcon";

export default function HaltLink({ halt }) {
  const location = useLocation();
  const { currentLatLng, routes } = useData();

  // Extract latLng from current pathname
  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  // Calculate distance if currentLatLng is available
  const distanceKm =
    currentLatLng && halt.latLng ? currentLatLng.distanceTo(halt.latLng) : null;

  // Find routes that serve this halt
  const servingRoutes = routes.filter((route) => route.hasHalt(halt));

  // Calculate opacity based on walking time at 4 kmph
  // < 10 min (~0.67 km): opacity = 1
  // 10 min to 1 hr (0.67-4 km): opacity = 0.67
  // > 1 hr (>4 km): opacity = 0.33
  let opacity = 1;
  if (distanceKm) {
    if (distanceKm > 4) {
      opacity = 0.33;
    } else if (distanceKm >= 0.667) {
      opacity = 0.67;
    }
  }

  return (
    <Link
      to={`/${latLng}/halt/${encodeURIComponent(halt.id)}`}
      style={{ textDecoration: "none", width: "100%", color: "inherit" }}
    >
      <Box sx={{ py: 1, px: 2, opacity }}>
        <Typography variant="body1">{halt.displayName}</Typography>
        <Distance distanceKm={distanceKm} />
        {servingRoutes.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
            {servingRoutes.map((route) => (
              <RouteIcon key={route.id} route={route} />
            ))}
          </Box>
        )}
      </Box>
    </Link>
  );
}
