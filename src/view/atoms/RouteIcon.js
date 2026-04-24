import { Box, Typography } from "@mui/material";
import RouteIcon from "@mui/icons-material/Route";

export default function RouteIconView({ route }) {

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
        {route.shortLabel}
      </Typography>
    </Box>
  );
}
