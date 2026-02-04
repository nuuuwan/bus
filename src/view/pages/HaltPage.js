import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
} from "@mui/material";
import { useData } from "../../nonview/contexts/DataContext";
import RouteLink from "../moles/RouteLink";

export default function HaltPage() {
  const { selectedHalt, routes, currentLatLng, loading } = useData();

  // Find all routes that include this bus halt
  const routesForHalt = selectedHalt
    ? routes.filter((route) => route.hasHalt(selectedHalt))
    : [];

  // Sort by distance to closest halt if currentLatLng is available
  const sortedRoutes = currentLatLng
    ? [...routesForHalt].sort((a, b) => {
        const closestA =
          a.haltList.length > 0
            ? Math.min(
                ...a.haltList
                  .filter((halt) => halt.latLng)
                  .map((halt) => currentLatLng.distanceTo(halt.latLng)),
              )
            : Infinity;
        const closestB =
          b.haltList.length > 0
            ? Math.min(
                ...b.haltList
                  .filter((halt) => halt.latLng)
                  .map((halt) => currentLatLng.distanceTo(halt.latLng)),
              )
            : Infinity;
        return closestA - closestB;
      })
    : routesForHalt;

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
        {sortedRoutes.length > 0 && (
          <List sx={{ p: 1, m: 1 }}>
            {sortedRoutes.map((route) => (
              <ListItem key={route.routeNum} disablePadding>
                <RouteLink route={route} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
