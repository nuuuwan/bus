import { Box, Typography } from "@mui/material";
import RouteIcon from "@mui/icons-material/Route";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Link, useLocation } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import { useClock } from "../../nonview/contexts/ClockContext";
import { formatDuration } from "../../nonview/base/Duration";
import Distance from "../atoms/Distance";
import NumberPlate from "../atoms/NumberPlate";

export default function RouteLink({ route, nextArrivalMs, nextBuses }) {
  const location = useLocation();
  const { currentLatLng, buses } = useData();
  const now = useClock();

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

  // Arrival display (used when nextArrivalMs is provided — halt view, single bus)
  let durationStr = null;
  if (nextArrivalMs !== null && nextArrivalMs !== undefined) {
    durationStr = formatDuration(Math.max(0, nextArrivalMs - now));
  }

  // nextBuses: [{bus, arrivalMs}, ...] — used in halt view when multiple buses
  const hasNextBuses = nextBuses && nextBuses.length > 0;

  // Next 3 arrivals at closest halt (used in routes list when no nextArrivalMs)
  const next3Arrivals =
    nextArrivalMs === null || nextArrivalMs === undefined
      ? (() => {
          if (!closestHalt?.latLng || !buses?.length) return [];
          const routeBuses = buses.filter((b) => b.route.id === route.id);
          return routeBuses
            .map((b) => b.nextArrivalAt(closestHalt.latLng, now))
            .sort((a, b) => a - b)
            .slice(0, 1);
        })()
      : [];

  const nextArrival = next3Arrivals[0] ?? null;

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
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              px: 1,
              py: 0.4,
              borderRadius: 2,
              backgroundColor: route.getColor(),
              color: "#fff",
            }}
          >
            <RouteIcon sx={{ fontSize: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {route.shortLabel}
            </Typography>
          </Box>
        </Box>
        {hasNextBuses ? (
          <Box mt={0.5}>
            {nextBuses.map(({ bus, arrivalMs }) => {
              const dur = formatDuration(Math.max(0, arrivalMs - now));
              return (
                <Box key={bus.id} display="flex" alignItems="center" gap={0.5}>
                  <NumberPlate bus={bus} />
                  <AccessTimeIcon sx={{ fontSize: 14 }} color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {dur}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        ) : durationStr !== null ? (
          <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {durationStr}
            </Typography>
          </Box>
        ) : (
          <>
            {closestHalt && (
              <Typography variant="caption" color="text.secondary">
                via {closestHalt.displayName}
              </Typography>
            )}
            <Box mt={0.5}>
              <Distance distanceKm={closestDistanceKm} />
            </Box>
            {nextArrival !== null && (
              <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                <AccessTimeIcon sx={{ fontSize: 14 }} color="action" />
                <Typography variant="caption" color="text.secondary">
                  {formatDuration(Math.max(0, nextArrival - now))}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Link>
  );
}
