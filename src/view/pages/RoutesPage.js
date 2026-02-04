import { Box, CircularProgress } from "@mui/material";
import { useData } from "../../nonview/contexts/DataContext";
import RouteLink from "../moles/RouteLink";

export default function RoutesPage() {
  const { routes, currentLatLng, loading } = useData();

  // Sort by distance to closest halt if currentLatLng is available
  const sortedRoutes = currentLatLng
    ? [...routes].sort((a, b) => {
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
    : routes;

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

  return (
    <Box display="flex" height="100vh">
      <Box width="100%" overflow="auto" p={2}>
        {sortedRoutes.map((route) => (
          <RouteLink
            key={`${route.routeNum}-${route.direction}`}
            route={route}
          />
        ))}
      </Box>
    </Box>
  );
}
