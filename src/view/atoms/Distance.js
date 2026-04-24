import { Typography, Box } from "@mui/material";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { formatDuration } from "../../nonview/base/Duration";

export default function Distance({ distanceKm }) {
  if (distanceKm === null || distanceKm === undefined) {
    return null;
  }

  let displayText;

  if (distanceKm >= 1) {
    displayText = `${distanceKm.toFixed(1)} km`;
  } else {
    const meters = distanceKm * 1000;
    if (meters < 10) {
      displayText = "<10 m";
    } else {
      displayText = `${Math.round(meters / 10) * 10} m`;
    }
  }

  const walkingMs = (distanceKm / 4) * 60 * 60 * 1000;
  const timeText = formatDuration(walkingMs);

  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      <DirectionsWalkIcon fontSize="small" color="action" />
      <Typography variant="body2" color="text.secondary">
        {displayText} · {timeText}
      </Typography>
    </Box>
  );
}
