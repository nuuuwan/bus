import { Box, CircularProgress } from "@mui/material";
import { useData } from "../../nonview/contexts/DataContext";
import RouteLink from "../moles/RouteLink";

export default function RoutesPage() {
  const { routes, loading } = useData();

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
        {routes.map((route) => (
          <RouteLink
            key={`${route.routeNum}-${route.direction}`}
            route={route}
          />
        ))}
      </Box>
    </Box>
  );
}
