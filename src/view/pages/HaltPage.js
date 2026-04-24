import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
} from "@mui/material";
import { useData } from "../../nonview/contexts/DataContext";
import { useClock } from "../../nonview/contexts/ClockContext";
import RouteLink from "../moles/RouteLink";
import Distance from "../atoms/Distance";

export default function HaltPage() {
  const { selectedHalt, routes, buses, currentLatLng, loading } = useData();
  const now = useClock();

  const routesForHalt = selectedHalt
    ? routes.filter((route) => route.hasHalt(selectedHalt))
    : [];

  // Distance from user to the selected halt (shared for all routes)
  const haltDistanceKm =
    currentLatLng && selectedHalt?.latLng
      ? currentLatLng.distanceTo(selectedHalt.latLng)
      : null;

  // For each route, find up to 3 next buses and their arrivals at this halt
  const routesWithBuses = routesForHalt.map((route) => {
    const routeBuses = buses.filter((b) => b.route.id === route.id);
    const next3 = selectedHalt?.latLng
      ? routeBuses
          .map((b) => ({ bus: b, arrivalMs: b.nextArrivalAt(selectedHalt.latLng, now) }))
          .sort((a, b) => a.arrivalMs - b.arrivalMs)
          .slice(0, 3)
      : [];
    return { route, nextBuses: next3 };
  });

  // Sort by earliest arrival
  const sorted = [...routesWithBuses].sort((a, b) => {
    const aMs = a.nextBuses[0]?.arrivalMs ?? Infinity;
    const bMs = b.nextBuses[0]?.arrivalMs ?? Infinity;
    return aMs - bMs;
  });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedHalt) {
    return (
      <Box p={3}>
        <Typography variant="h5">Halt not found</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" height="100vh">
      <Box width="100%" overflow="auto">
        {haltDistanceKm !== null && (
          <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <Distance distanceKm={haltDistanceKm} />
          </Box>
        )}
        <List sx={{ p: 1, m: 1 }}>
          {sorted.map(({ route, nextBuses }) => (
            <ListItem key={route.id} disablePadding>
              <RouteLink route={route} nextBuses={nextBuses} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
