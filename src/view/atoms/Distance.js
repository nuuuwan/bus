import { Typography, Box } from "@mui/material";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";

export default function Distance({ distanceKm }) {
  if (distanceKm === null || distanceKm === undefined) {
    return null;
  }

  let displayText;

  if (distanceKm >= 1) {
    // >= 1 km: show in km rounded to 1 decimal places
    displayText = `${distanceKm.toFixed(1)} km`;
  } else {
    // < 1 km: convert to meters
    const meters = distanceKm * 1000;
    if (meters < 10) {
      displayText = "<10m";
    } else {
      displayText = `${Math.round(meters / 10) * 10} m`;
    }
  }

  // Calculate walking time at 4 kmph
  const walkingSpeedKmph = 4;
  const timeHours = distanceKm / walkingSpeedKmph;
  const timeMinutes = Math.round(timeHours * 60);

  let timeText;
  if (timeMinutes < 1) {
    timeText = "<1 min";
  } else if (timeMinutes < 60) {
    timeText = `${timeMinutes} min`;
  } else {
    const hours = Math.floor(timeMinutes / 60);
    const mins = timeMinutes % 60;
    timeText = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }

  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      <DirectionsWalkIcon fontSize="small" color="action" />
      <Typography variant="body2" color="text.secondary">
        {displayText} · {timeText}
      </Typography>
    </Box>
  );
}
