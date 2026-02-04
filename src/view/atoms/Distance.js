import { Typography } from "@mui/material";

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

  return (
    <Typography variant="body2" color="text.secondary">
      ({displayText})
    </Typography>
  );
}
