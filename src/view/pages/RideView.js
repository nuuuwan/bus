import { Box, Button, Divider, Typography } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import { useNavigate, useLocation } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import { useClock } from "../../nonview/contexts/ClockContext";
import { formatDuration } from "../../nonview/base/Duration";
import HaltInfo from "../atoms/HaltInfo";
import DrawerPage from "../moles/DrawerPage";

export default function RideView() {
  const { ride, alightBus, rideHistory } = useData();
  const now = useClock();
  const navigate = useNavigate();
  const location = useLocation();

  if (!ride) return null;

  const atHalt = ride.bus.currentHalt(now);
  const durationMs = now - ride.boardedAtMs;

  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  return (
    <DrawerPage>
      <Box sx={{ px: 2, py: 1 }}>
        {/* Current status */}
        <Box mb={1}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.25 }}
          >
            {atHalt ? "Currently at" : "Travelling…"}
          </Typography>
          {atHalt ? (
            <HaltInfo halt={atHalt} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Between stops
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 0.75 }} />

        {/* Boarded at */}
        <Box mb={1}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.25 }}
          >
            Boarded at
          </Typography>
          <HaltInfo halt={ride.boardedAtHalt} />
        </Box>

        {/* Duration + Fare */}
        <Box display="flex" gap={2} mb={1.5}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Duration
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatDuration(durationMs)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Fare
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              LKR {ride.fare.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {/* Actions */}
        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<ExitToAppIcon />}
            disabled={!atHalt}
            onClick={() => {
              alightBus(atHalt);
              navigate(`/${latLng}`);
            }}
            sx={{ textTransform: "none" }}
          >
            Get Off
          </Button>
          {rideHistory.length > 0 && (
            <Button
              variant="text"
              size="small"
              startIcon={<AirlineSeatReclineExtraIcon />}
              onClick={() => navigate(`/${latLng}/rides`)}
              sx={{ textTransform: "none" }}
            >
              History
            </Button>
          )}
        </Box>
      </Box>
    </DrawerPage>
  );
}
