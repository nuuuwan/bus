import { Box, Typography, Paper } from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

export default function RouteView({ route }) {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <DirectionsBusIcon fontSize="large" sx={{ color: route.getColor() }} />
        <Typography variant="h4" sx={{ color: route.getColor() }}>
          {route.routeNum}
        </Typography>
        <Typography variant="h6">{route.direction}</Typography>
      </Box>
    </Paper>
  );
}
