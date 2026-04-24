import { Box, Typography } from "@mui/material";
import RouteIcon from "@mui/icons-material/Route";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Link, useLocation } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import { useClock } from "../../nonview/contexts/ClockContext";
import Distance from "../atoms/Distance";

const getDirectionIcon = (direction) => {
  const dir = direction?.toLowerCase() || "";
  if (dir.includes("north")) return <NorthIcon fontSize="small" />;
  if (dir.includes("south")) return <SouthIcon fontSize="small" />;
  if (dir.includes("east")) return <EastIcon fontSize="small" />;
  if (dir.includes("west")) return <WestIcon fontSize="small" />;
  return null;
};

export default function RouteLink({ route, nextArrivalMs }) {
  const location = useLocation();
  const { currentLatLng } = useData();
  const now = useClock();
  const directionIcon = getDirectionIcon(route.direction);

  // Extract latLng from current pathname
  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  // Find closest halt on this route and its distance (used when no nextArrivalMs)
  const haltsWithLatLng = currentLatLng
    ? route.haltList.filter((halt) => halt.latLng)
    : [];
  const closestHalt =
    haltsWithLatLng.length > 0
      ? haltsWithLatLng.reduce((best, halt) =>
          currentLatLng.distanceTo(halt.latLng) <
          currentLatLng.distanceTo(best.latLng)
            ? halt
            : best,
        )
      : null;
  const closestDistanceKm = closestHalt
    ? currentLatLng.distanceTo(closestHalt.latLng)
    : null;

  // Calculate opacity based on walking time at 4 kmph
  let opacity = 1;
  if (closestDistanceKm) {
    if (closestDistanceKm > 4) {
      opacity = 0.33;
    } else if (closestDistanceKm >= 0.667) {
      opacity = 0.67;
    }
  }

  // Arrival display (used when nextArrivalMs is provided)
  let arrivalTimeStr = null;
  let minsUntil = null;
  if (nextArrivalMs !== null && nextArrivalMs !== undefined) {
    minsUntil = Math.max(0, Math.round((nextArrivalMs - now) / 60_000));
    arrivalTimeStr = new Date(nextArrivalMs).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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
          <RouteIcon sx={{ color: route.getColor() }} />
          <Typography variant="h6" sx={{ color: route.getColor() }}>
            {route.routeNum}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            {directionIcon}
            <Typography variant="body2">{route.direction}</Typography>
          </Box>
        </Box>
        {arrivalTimeStr !== null ? (
          <Box display="flex" alignItems="center" gap={0.5}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {arrivalTimeStr} · {minsUntil === 0 ? "arriving" : `${minsUntil} min`}
            </Typography>
          </Box>
        ) : (
          <>
            <Distance distanceKm={closestDistanceKm} />
            {closestHalt && (
              <Typography variant="caption" color="text.secondary">
                via {closestHalt.displayName}
              </Typography>
            )}
          </>
        )}
      </Box>
    </Link>
  );
}
