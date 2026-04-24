import { Box, Typography } from "@mui/material";
import RouteIcon from "@mui/icons-material/Route";

export default function RouteIconView({ route }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.25,
        px: 0.75,
        py: 0.25,
        borderRadius: 2,
        backgroundColor: route.getColor(),
        color: "#fff",
      }}
    >
      <RouteIcon sx={{ fontSize: 12 }} />
      <Typography variant="caption" sx={{ fontWeight: 600 }}>{route.shortLabel}</Typography>
    </Box>
  );
}
