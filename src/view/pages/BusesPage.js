import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { useNavigate, useLocation } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import { useClock } from "../../nonview/contexts/ClockContext";
import { formatDuration } from "../../nonview/base/Duration";
import Distance from "../atoms/Distance";
import RouteIcon from "../atoms/RouteIcon";

export default function BusesPage() {
  const { buses, currentLatLng, loading } = useData();
  const now = useClock();
  const navigate = useNavigate();
  const location = useLocation();

  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  const _totalTimeMs = (bus) => {
    const nextHalt = bus.nextHaltArrival(now);
    if (!nextHalt || !currentLatLng || !nextHalt.halt.latLng) return Infinity;
    const walkDistKm = currentLatLng.distanceTo(nextHalt.halt.latLng);
    const walkMs = (walkDistKm / 4) * 60 * 60 * 1000;
    const waitMs = Math.max(0, nextHalt.arrivalMs - now);
    return walkMs + waitMs;
  };

  const sortedBuses = currentLatLng
    ? [...buses].sort((a, b) => _totalTimeMs(a) - _totalTimeMs(b))
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
              <ListItem key={bus.id} disablePadding>
                <ListItemButton
                  onClick={() =>
                    navigate(
                      `/${latLng}/bus/${encodeURIComponent(bus.id)}`,
                    )
                  }
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    gap: 1.5,
                  }}
                >
                  <AirportShuttleIcon
                    sx={{ color: bus.route.getColor(), flexShrink: 0 }}
                  />
                  <Box flex={1} minWidth={0}>
                    <RouteIcon route={bus.route} />
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                    >
                      {bus.numberPlate}
                    </Typography>
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
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
