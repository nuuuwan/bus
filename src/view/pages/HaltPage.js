import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItemButton,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate, useLocation } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import { useClock } from "../../nonview/contexts/ClockContext";
import { formatArrival } from "../../nonview/base/Duration";
import Distance from "../atoms/Distance";
import NumberPlate from "../atoms/NumberPlate";

export default function HaltPage() {
  const { selectedHalt, routes, buses, currentLatLng, loading } = useData();
  const now = useClock();
  const navigate = useNavigate();
  const location = useLocation();

  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  // Distance from user to the selected halt
  const haltDistanceKm =
    currentLatLng && selectedHalt?.latLng
      ? currentLatLng.distanceTo(selectedHalt.latLng)
      : null;

  // Flat list of all buses serving this halt, sorted by next arrival
  const busItems = selectedHalt?.latLng
    ? routes
        .filter((route) => route.hasHalt(selectedHalt))
        .flatMap((route) => buses.filter((b) => b.route.id === route.id))
        .map((bus) => ({
          bus,
          arrivalMs: bus.nextArrivalAt(selectedHalt.latLng, now),
        }))
        .sort((a, b) => a.arrivalMs - b.arrivalMs)
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
      <Box width="100%" overflow="auto">
        {haltDistanceKm !== null && (
          <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <Distance distanceKm={haltDistanceKm} />
          </Box>
        )}
        <List sx={{ p: 0 }}>
          {busItems.map(({ bus, arrivalMs }) => (
            <ListItemButton
              key={bus.id}
              onClick={() =>
                navigate(`/${latLng}/bus/${encodeURIComponent(bus.id)}`)
              }
              sx={{
                py: 1.5,
                px: 2,
                gap: 1,
              }}
            >
              <NumberPlate bus={bus} />
              <AccessTimeIcon sx={{ fontSize: 14 }} color="action" />
              <Typography variant="caption" color="text.secondary">
                {formatArrival(arrivalMs, now)}
              </Typography>
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
}
