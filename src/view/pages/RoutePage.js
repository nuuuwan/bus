import { Box, Typography, Paper, CircularProgress } from "@mui/material";
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
        <Paper elevation={3}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Halts ({selectedRoute.haltList.length})
            </Typography>
            {selectedRoute.haltList.map((halt, index) => (
              <Link
                key={index}
                to={`/halt/${encodeURIComponent(halt.id)}`}
                style={{ textDecoration: "none" }}
              >
                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ minWidth: "30px" }}
                  >
                    {index + 1}.
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <HaltView halt={halt} />
                  </Box>
                </Box>
              </Link>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
