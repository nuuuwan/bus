import { Box, Typography } from "@mui/material";
import { useData } from "../../nonview/contexts/DataContext";
import RouteIconView from "./RouteIcon";

export default function RouteInfo({ route }) {
  const { buses } = useData();
  const busCount = buses.filter((b) => b.route.id === route.id).length;

  return (
    <Box display="flex" alignItems="center" gap={0.75} flexWrap="wrap">
      <RouteIconView route={route} />
      <Typography variant="caption" color="text.secondary">
        {busCount} {busCount === 1 ? "bus" : "buses"}
      </Typography>
    </Box>
  );
}
