import { Box, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { Link, useLocation } from "react-router-dom";
import { useClock } from "../../nonview/contexts/ClockContext";
import { formatArrival } from "../../nonview/base/Duration";
import Distance from "../atoms/Distance";
import NumberPlate from "../atoms/NumberPlate";

export default function HaltLink({ halt, buses = [], nextBus }) {
  const location = useLocation();
  const now = useClock();

  // Extract latLng from current pathname
  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  // When nextBus isn't explicitly passed, find the soonest bus from `buses`
  const resolvedNextBus =
    nextBus ??
    (halt.latLng && buses.length > 0
      ? buses
          .map((b) => ({ bus: b, arrivalMs: b.nextArrivalAt(halt.latLng, now) }))
          .sort((a, b) => a.arrivalMs - b.arrivalMs)[0]
      : null);

  return (
    <Link
      to={`/${latLng}/halt/${encodeURIComponent(halt.id)}`}
      style={{ textDecoration: "none", width: "100%", color: "inherit" }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box display="flex" alignItems="center" gap={0.5}>
          <StopCircleIcon sx={{ fontSize: 16 }} color="action" />
          <Typography variant="body1">{halt.displayName}</Typography>
        </Box>
        {resolvedNextBus && (
          <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
            <NumberPlate bus={resolvedNextBus.bus} />
            <AccessTimeIcon sx={{ fontSize: 13 }} color="action" />
            <Typography variant="caption" color="text.secondary">
              {formatArrival(resolvedNextBus.arrivalMs, now)}
            </Typography>
          </Box>
        )}
      </Box>
    </Link>
  );
}
