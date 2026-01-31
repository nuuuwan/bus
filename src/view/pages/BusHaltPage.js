import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { useData } from "../../nonview/contexts/DataContext";
import MapView from "../moles/MapView";

export default function BusHaltPage() {
  const { selectedBusHalt, loading } = useData();

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

  if (!selectedBusHalt) {
    return (
      <Box p={3}>
        <Typography variant="h5">Bus halt not found</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" height="100vh">
      <Box width="30%" overflow="auto" p={2}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            {selectedBusHalt.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Coordinates
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
            Latitude: {selectedBusHalt.latLng[0]}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
            Longitude: {selectedBusHalt.latLng[1]}
          </Typography>
        </Paper>
      </Box>
      <Box width="70%">
        <MapView />
      </Box>
    </Box>
  );
}
