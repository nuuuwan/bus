import { Box, Typography } from "@mui/material";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { useData } from "../../nonview/contexts/DataContext";
import RouteIconView from "./RouteIcon";
import Distance from "./Distance";

export default function HaltInfo({ halt, showRoutes = true }) {
  const { routes, currentLatLng } = useData();

  const haltRoutes = routes.filter((route) => route.hasHalt(halt));
  const distanceKm =
    currentLatLng && halt.latLng
      ? currentLatLng.distanceTo(halt.latLng)
      : null;

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={0.5} flexWrap="wrap">
        <StopCircleIcon sx={{ fontSize: 16 }} color="action" />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {halt.displayName}
        </Typography>
      </Box>
      {showRoutes && haltRoutes.length > 0 && (
        <Box display="flex" gap={0.5} flexWrap="wrap" mt={0.25}>
          {haltRoutes.map((route) => (
            <RouteIconView key={route.id} route={route} />
          ))}
        </Box>
      )}
      {distanceKm !== null && (
        <Box mt={0.25}>
          <Distance distanceKm={distanceKm} />
        </Box>
      )}
    </Box>
  );
}
