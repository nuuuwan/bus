import { Box, Chip, ListItemButton, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate, useLocation } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import { useClock } from "../../nonview/contexts/ClockContext";
import { formatArrival } from "../../nonview/base/Duration";
import Distance from "../atoms/Distance";
import RouteInfo from "../atoms/RouteInfo";
import BusInfo from "../atoms/BusInfo";
import HaltInfo from "../atoms/HaltInfo";

export default function RouteLink({ route, nextArrivalMs, nextBuses }) {
  const location = useLocation();
  const navigate = useNavigate();
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
    durationStr = formatArrival(nextArrivalMs, now);
  }

  // nextBuses: [{bus, arrivalMs}, ...] — used in halt view when multiple buses
  const hasNextBuses = nextBuses && nextBuses.length > 0;

  // Find the best catchable bus: the one whose next halt is closest to the user,
  // paired with that halt and its arrival time.
  const bestCatch = (() => {
    if (!currentLatLng || !buses?.length) return null;
    const routeBuses = buses.filter((b) => b.route.id === route.id);
    if (routeBuses.length === 0) return null;

    let best = null;
    let bestDist = Infinity;

    for (const bus of routeBuses) {
      const nextHaltArrival = bus.nextHaltArrival(now);
      if (!nextHaltArrival || !nextHaltArrival.halt.latLng) continue;
      const d = currentLatLng.distanceTo(nextHaltArrival.halt.latLng);
      if (d < bestDist) {
        bestDist = d;
        best = {
          bus,
          halt: nextHaltArrival.halt,
          arrivalMs: nextHaltArrival.arrivalMs,
          distanceKm: d,
        };
      }
    }
    return best;
  })();

  return (
    <ListItemButton
      divider
      onClick={() =>
        navigate(`/${latLng}/route/${encodeURIComponent(route.id)}`)
      }
      sx={{
        flexDirection: "column",
        alignItems: "flex-start",
        py: 1.5,
        px: 2,
        opacity,
      }}
    >
      <RouteInfo route={route} />
      {hasNextBuses ? (
        <Box mt={0.5}>
          {nextBuses.map(({ bus, arrivalMs }) => {
            const isAtHalt = !!bus.currentHalt(now);
            const dur = formatArrival(arrivalMs, now);
            return (
              <Box key={bus.id} display="flex" alignItems="center" gap={0.5} flexWrap="wrap">
                <BusInfo bus={bus} />
                {isAtHalt ? (
                  <Chip label="Boarding" size="small" color="success" variant="outlined" sx={{ height: 18, fontSize: "0.65rem" }} />
                ) : (
                  <>
                    <AccessTimeIcon sx={{ fontSize: 14 }} color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {dur}
                    </Typography>
                  </>
                )}
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
          {bestCatch && (
            <Box display="flex" alignItems="center" gap={0.5} mt={0.5} flexWrap="wrap">
              <BusInfo bus={bestCatch.bus} />
              {bestCatch.bus.currentHalt(now) ? (
                <Chip label="Boarding" size="small" color="success" variant="outlined" sx={{ height: 18, fontSize: "0.65rem" }} />
              ) : bestCatch.arrivalMs !== null ? (
                <>
                  <AccessTimeIcon sx={{ fontSize: 14 }} color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {formatArrival(bestCatch.arrivalMs, now)}
                  </Typography>
                </>
              ) : null}
            </Box>
          )}
          {bestCatch?.halt && (
            <Box mt={0.25}>
              <HaltInfo halt={bestCatch.halt} />
            </Box>
          )}
          <Box mt={0.5}>
            <Distance distanceKm={bestCatch?.distanceKm ?? closestDistanceKm} />
          </Box>
        </>
      )}
    </ListItemButton>
  );
}
