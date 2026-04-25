import { Box, Typography } from "@mui/material";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { useData } from "../../nonview/contexts/DataContext";
import RouteIconView from "./RouteIcon";

export default function HaltInfo({ halt }) {
  const { routes } = useData();

  const haltRoutes = routes.filter((route) => route.hasHalt(halt));

  return (
    <Box display="flex" alignItems="center" gap={0.5} flexWrap="wrap">
      <StopCircleIcon sx={{ fontSize: 16 }} color="action" />
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {halt.displayName}
      </Typography>
      {haltRoutes.map((route) => (
        <RouteIconView key={route.id} route={route} />
      ))}
    </Box>
  );
}
