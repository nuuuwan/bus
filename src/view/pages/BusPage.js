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
  const nextHalts = bus.nextHaltArrivals(3, now);

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

      {/* Next halts */}
      {nextHalts.length > 0 && (
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
            Next Halts
          </Typography>
          {nextHalts.map(({ halt, arrivalMs }, i) => (
            <Box
              key={halt.id ?? i}
              display="flex"
              alignItems="center"
              gap={1}
              mt={0.75}
            >
              <StopCircleIcon color="action" sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{ flex: 1 }}>
                {halt.displayName}
              </Typography>
              <AccessTimeIcon sx={{ fontSize: 14 }} color="action" />
              <Typography variant="body2" color="text.secondary">
                {formatDuration(Math.max(0, arrivalMs - now))}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
