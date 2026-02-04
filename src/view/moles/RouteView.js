import { Box, Typography } from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";

const getDirectionIcon = (direction) => {
  const dir = direction?.toLowerCase() || "";
  if (dir.includes("north")) return <NorthIcon fontSize="small" />;
  if (dir.includes("south")) return <SouthIcon fontSize="small" />;
  if (dir.includes("east")) return <EastIcon fontSize="small" />;
  if (dir.includes("west")) return <WestIcon fontSize="small" />;
  return null;
};

export default function RouteView({ route }) {
  const directionIcon = getDirectionIcon(route.direction);

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <DirectionsBusIcon sx={{ color: route.getColor() }} />
      <Typography variant="h6" sx={{ color: route.getColor() }}>
        {route.routeNum}
      </Typography>
      <Box display="flex" alignItems="center" gap={0.5}>
        {directionIcon}
        <Typography variant="body2">{route.direction}</Typography>
      </Box>
    </Box>
  );
}
