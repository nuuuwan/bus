import { Box, Typography } from "@mui/material";
import RouteIcon from "@mui/icons-material/Route";

export default function RouteIconView({ route }) {
  const directionLetter = route.direction
    ? route.direction.charAt(0).toUpperCase()
    : "";

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.25,
        px: 0.5,
        py: 0.25,
        borderRadius: 0.5,
        color: route.getColor(),
      }}
    >
      <RouteIcon sx={{ fontSize: 12 }} />
      <Typography variant="caption">
        {route.routeNum + directionLetter}
      </Typography>
    </Box>
  );
}
