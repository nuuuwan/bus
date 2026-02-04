import { Box, Typography, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import HaltLink from "../moles/HaltLink";
import RouteLink from "../moles/RouteLink";

export default function HaltPage() {
  const { selectedHalt, routes, loading } = useData();

  // Find all routes that include this bus halt
  const routesForHalt = selectedHalt
    ? routes.filter((route) => route.hasHalt(selectedHalt))
    : [];

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
      <Box width="100%" overflow="auto" p={2}>
        <HaltLink halt={selectedHalt} />

        {routesForHalt.length > 0 && (
          <Box>
            <Box>
              {routesForHalt.map((route) => (
                <Link
                  key={route.routeNum}
                  to={`/route/${encodeURIComponent(route.id)}`}
                  style={{ textDecoration: "none" }}
                >
                  <RouteLink route={route} />
                </Link>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
