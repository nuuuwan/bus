import { Box, CircularProgress, Typography } from "@mui/material";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useData } from "../../nonview/contexts/DataContext";
import { useClock } from "../../nonview/contexts/ClockContext";
import { formatDuration } from "../../nonview/base/Duration";
import Distance from "../atoms/Distance";
import RouteIcon from "../atoms/RouteIcon";

export default function BusPage() {
  const { selectedBus, currentLatLng, loading } = useData();
  const now = useClock();

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

  if (!selectedBus) {
    return (
      <Box p={3}>
        <Typography variant="h5">Bus not found</Typography>
      </Box>
    );
  }

  const bus = selectedBus;
  const route = bus.route;
  const pos = bus.latLngAt(now);
  const distanceKm =
    currentLatLng && pos ? currentLatLng.distanceTo(pos) : null;
  const nextHalt = bus.nextHaltArrival(now);
  const nextHaltDuration = nextHalt
    ? formatDuration(Math.max(0, nextHalt.arrivalMs - now))
    : null;

  return (
    <Box p={2} display="flex" flexDirection="column" gap={2}>
      {/* Bus identity */}
      <Box display="flex" alignItems="center" gap={1.5}>
        <AirportShuttleIcon sx={{ color: route.getColor(), fontSize: 36 }} />
        <Box>
          <Typography variant="h5" sx={{ color: route.getColor() }}>
            {bus.numberPlate}
          </Typography>
          <Distance distanceKm={distanceKm} />
        </Box>
      </Box>

      {/* Route */}
      <Box
        sx={{
          p: 1.5,
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="overline"
          color="text.secondary"
          display="block"
          lineHeight={1.5}
        >
          Route
        </Typography>
        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
          <RouteIcon route={route} />
          <Typography variant="body1">{route.displayName}</Typography>
        </Box>
      </Box>

      {/* Next halt */}
      {nextHalt && (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="overline"
            color="text.secondary"
            display="block"
            lineHeight={1.5}
          >
            Next Halt
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
            <StopCircleIcon color="action" />
            <Typography variant="body1">{nextHalt.halt.displayName}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
            <AccessTimeIcon sx={{ fontSize: 14 }} color="action" />
            <Typography variant="body2" color="text.secondary">
              {nextHaltDuration}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
