import { Typography } from "@mui/material";

export default function Distance({ distanceKm }) {
  if (distanceKm === null || distanceKm === undefined) {
    return null;
  }

  let displayText;

  if (distanceKm >= 1) {
    displayText = `${parseFloat(distanceKm.toPrecision(2))} km`;
  } else {
    displayText = `${parseFloat((distanceKm * 1000).toPrecision(2))} m`;
  }

  return (
    <Typography variant="body2" color="text.secondary">
      {displayText}
    </Typography>
  );
}
