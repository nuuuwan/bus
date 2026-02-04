import { Box, Typography, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import RouteView from "../moles/RouteView";
import HaltView from "../moles/HaltView";

export default function RoutePage() {
  const { selectedRoute, loading } = useData();

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

  if (!selectedRoute) {
    return (
      <Box p={3}>
        <Typography variant="h5">Route not found</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" height="100vh">
      <Box width="100%" overflow="auto" p={2}>
        <RouteView route={selectedRoute} />

        <Box>
          {selectedRoute.haltList.map((halt, index) => (
            <Link
              key={index}
              to={`/halt/${encodeURIComponent(halt.id)}`}
              style={{ textDecoration: "none" }}
            >
              <Box sx={{ flex: 1 }}>
                <HaltView halt={halt} />
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
