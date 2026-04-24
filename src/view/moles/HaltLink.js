import { Box, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Link, useLocation } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import { useClock } from "../../nonview/contexts/ClockContext";
import { formatDuration } from "../../nonview/base/Duration";
import Distance from "../atoms/Distance";
import RouteIcon from "../atoms/RouteIcon";

export default function HaltLink({ halt, buses = [], nextBus }) {
  const location = useLocation();
  const { currentLatLng, routes } = useData();
  const now = useClock();

  // Extract latLng from current pathname
  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  // Calculate distance if currentLatLng is available
  const distanceKm =
    currentLatLng && halt.latLng ? currentLatLng.distanceTo(halt.latLng) : null;

  // Find routes that serve this halt, with next arrival, sorted by arrival time
  const servingRoutesWithArrival = routes
    .filter((route) => route.hasHalt(halt))
    .map((route) => {
      const routeBuses = buses.filter((b) => b.route.id === route.id);
      const nextArrivalMs =
        routeBuses.length > 0 && halt.latLng
          ? Math.min(
              ...routeBuses.map((b) => b.nextArrivalAt(halt.latLng, now)),
            )
          : null;
      return { route, nextArrivalMs };
    })
    .sort((a, b) => {
      if (a.nextArrivalMs === null) return 1;
      if (b.nextArrivalMs === null) return -1;
      return a.nextArrivalMs - b.nextArrivalMs;
    });

  return (
    <Link
      to={`/${latLng}/halt/${encodeURIComponent(halt.id)}`}
      style={{ textDecoration: "none", width: "100%", color: "inherit" }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="body1">{halt.displayName}</Typography>
        {nextBus && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <AccessTimeIcon sx={{ fontSize: 13 }} color="action" />
            <Typography variant="caption" color="text.secondary">
              {nextBus.bus.numberPlate} ·{" "}
              {formatDuration(Math.max(0, nextBus.arrivalMs - now))}
            </Typography>
          </Box>
        )}
        <Distance distanceKm={distanceKm} />
        {servingRoutesWithArrival.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
            {servingRoutesWithArrival.map(({ route, nextArrivalMs }) => {
              const durationStr =
                nextArrivalMs !== null
                  ? formatDuration(Math.max(0, nextArrivalMs - now))
                  : null;
              return (
                <Box
                  key={route.id}
                  display="inline-flex"
                  alignItems="center"
                  gap={0.25}
                >
                  <RouteIcon route={route} />
                  {durationStr !== null && (
                    <Box display="inline-flex" alignItems="center" gap={0.25}>
                      <AccessTimeIcon sx={{ fontSize: 11 }} color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {durationStr}
                      </Typography>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Link>
  );
}
