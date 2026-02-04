import { Box, Typography, Paper } from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";

const getDirectionIcon = (direction) => {
  const dir = direction?.toLowerCase() || "";
  if (dir.includes("north")) return <NorthIcon />;
  if (dir.includes("south")) return <SouthIcon />;
  if (dir.includes("east")) return <EastIcon />;
  if (dir.includes("west")) return <WestIcon />;
  return null;
};

export default function RouteView({ route }) {
  const directionIcon = getDirectionIcon(route.direction);

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <DirectionsBusIcon fontSize="large" sx={{ color: route.getColor() }} />
        <Typography variant="h6" sx={{ color: route.getColor() }}>
          {route.routeNum}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          {directionIcon}
          <Typography variant="body1">{route.direction}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}
