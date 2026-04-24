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

  // For each bus, find the first upcoming halt where the user can walk in time.
  // Buses where no such halt exists (all missed) are hidden.
  const busItems = (() => {
    if (!currentLatLng) {
      return buses.map((bus) => ({ bus, catchable: null, walkingMs: null }));
    }
    return buses
      .flatMap((bus) => {
        const upcoming = bus.nextHaltArrivals(bus.route.haltList.length, now);
        const catchable = upcoming.find(({ halt, arrivalMs }) => {
          if (!halt.latLng) return false;
          const walkingMs =
            (currentLatLng.distanceTo(halt.latLng) / 4) * 3_600_000;
          return arrivalMs - now > walkingMs;
        });
        if (!catchable) return [];
        const walkingMs =
          (currentLatLng.distanceTo(catchable.halt.latLng) / 4) * 3_600_000;
        return [{ bus, catchable, walkingMs }];
      })
      .sort((a, b) => a.walkingMs - b.walkingMs);
  })();

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
          {busItems.map(({ bus, catchable, walkingMs }) => {
            const catchHaltDistKm = catchable
              ? currentLatLng.distanceTo(catchable.halt.latLng)
              : null;
            const busArrivalDuration = catchable
              ? formatDuration(Math.max(0, catchable.arrivalMs - now))
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
                    <Distance distanceKm={catchHaltDistKm} />
                    {catchable && (
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        mt={0.25}
                      >
                        <StopCircleIcon sx={{ fontSize: 13 }} color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {catchable.halt.displayName}
                        </Typography>
                        <AccessTimeIcon sx={{ fontSize: 13 }} color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {busArrivalDuration}
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
