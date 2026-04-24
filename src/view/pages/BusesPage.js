import {
  Box,
  CircularProgress,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { useNavigate, useLocation } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import { useClock } from "../../nonview/contexts/ClockContext";
import { formatDuration } from "../../nonview/base/Duration";
import Distance from "../atoms/Distance";
import RouteIcon from "../atoms/RouteIcon";
import NumberPlate from "../atoms/NumberPlate";

export default function BusesPage() {
  const { buses, currentLatLng, loading } = useData();
  const now = useClock();
  const navigate = useNavigate();
  const location = useLocation();

  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  const sortedBuses = currentLatLng
    ? [...buses].sort((a, b) => {
        const posA = a.latLngAt(now);
        const posB = b.latLngAt(now);
        const distA = posA ? currentLatLng.distanceTo(posA) : Infinity;
        const distB = posB ? currentLatLng.distanceTo(posB) : Infinity;
        return distA - distB;
      })
    : buses;

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
      <Box width="100%" overflow="auto">
        <List sx={{ p: 0 }}>
          {sortedBuses.map((bus) => {
            const pos = bus.latLngAt(now);
            const distanceKm =
              currentLatLng && pos ? currentLatLng.distanceTo(pos) : null;
            const nextHalt = bus.nextHaltArrival(now);
            const nextHaltDuration = nextHalt
              ? formatDuration(Math.max(0, nextHalt.arrivalMs - now))
              : null;

            return (
              <motion.div
                key={bus.id}
                layout
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <ListItemButton
                  onClick={() =>
                    navigate(`/${latLng}/bus/${encodeURIComponent(bus.id)}`)
                  }
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    gap: 1.5,
                  }}
                >
                  <Box flex={1} minWidth={0}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <NumberPlate bus={bus} />
                    </Box>
                    <RouteIcon route={bus.route} />
                    <Distance distanceKm={distanceKm} />
                    {nextHalt && (
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        mt={0.25}
                      >
                        <StopCircleIcon sx={{ fontSize: 13 }} color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {nextHalt.halt.displayName}
                        </Typography>
                        <AccessTimeIcon sx={{ fontSize: 13 }} color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {nextHaltDuration}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </ListItemButton>
              </motion.div>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
