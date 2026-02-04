import { Box, Typography } from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";
import { Link, useLocation } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import Distance from "../atoms/Distance";

const getDirectionIcon = (direction) => {
  const dir = direction?.toLowerCase() || "";
  if (dir.includes("north")) return <NorthIcon fontSize="small" />;
  if (dir.includes("south")) return <SouthIcon fontSize="small" />;
  if (dir.includes("east")) return <EastIcon fontSize="small" />;
  if (dir.includes("west")) return <WestIcon fontSize="small" />;
  return null;
};

export default function RouteLink({ route }) {
  const location = useLocation();
  const { currentLatLng } = useData();
  const directionIcon = getDirectionIcon(route.direction);

  // Extract latLng from current pathname
  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  // Calculate distance to closest halt on this route
  const closestDistanceKm =
    currentLatLng && route.haltList.length > 0
      ? Math.min(
          ...route.haltList
            .filter((halt) => halt.latLng)
            .map((halt) => currentLatLng.distanceTo(halt.latLng)),
        )
      : null;

  // Calculate opacity based on walking time at 4 kmph
  // < 10 min (~0.67 km): opacity = 1
  // 10 min to 1 hr (0.67-4 km): opacity = 0.67
  // > 1 hr (>4 km): opacity = 0.33
  let opacity = 1;
  if (closestDistanceKm) {
    if (closestDistanceKm > 4) {
      opacity = 0.33;
    } else if (closestDistanceKm >= 0.667) {
      opacity = 0.67;
    }
  }

  return (
    <Link
      to={`/${latLng}/route/${encodeURIComponent(route.id)}`}
      style={{ textDecoration: "none", width: "100%", color: "inherit" }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          opacity,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <DirectionsBusIcon sx={{ color: route.getColor() }} />
          <Typography variant="h6" sx={{ color: route.getColor() }}>
            {route.routeNum}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            {directionIcon}
            <Typography variant="body2">{route.direction}</Typography>
          </Box>
        </Box>
        <Distance distanceKm={closestDistanceKm} />
      </Box>
    </Link>
  );
}
