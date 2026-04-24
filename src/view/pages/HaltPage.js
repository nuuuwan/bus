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

  // For each route, find the earliest next bus arrival at this halt
  const routesWithArrival = routesForHalt.map((route) => {
    const routeBuses = buses.filter((b) => b.route.id === route.id);
    const nextArrivalMs =
      routeBuses.length > 0 && selectedHalt?.latLng
        ? Math.min(
            ...routeBuses.map((b) =>
              b.nextArrivalAt(selectedHalt.latLng, now),
            ),
          )
        : null;
    return { route, nextArrivalMs };
  });

  // Sort by earliest arrival
  const sorted = [...routesWithArrival].sort((a, b) => {
    if (a.nextArrivalMs === null) return 1;
    if (b.nextArrivalMs === null) return -1;
    return a.nextArrivalMs - b.nextArrivalMs;
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
          {sorted.map(({ route, nextArrivalMs }) => (
            <ListItem key={route.id} disablePadding>
              <RouteLink route={route} nextArrivalMs={nextArrivalMs} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
