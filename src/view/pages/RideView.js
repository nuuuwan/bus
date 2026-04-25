import { Box, Button, Divider, Typography } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import { useNavigate, useLocation } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import { useClock } from "../../nonview/contexts/ClockContext";
import { formatDurationSeconds } from "../../nonview/base/Duration";
import HaltInfo from "../atoms/HaltInfo";
import BusInfo from "../atoms/BusInfo";
import DrawerPage from "../moles/DrawerPage";

export default function RideView() {
  const { ride, alightBus, rideHistory } = useData();
  const now = useClock();
  const navigate = useNavigate();
  const location = useLocation();

  if (!ride) return null;

  const atHalt = ride.bus.currentHalt(now);
  const nextArrival = ride.bus.nextHaltArrival(now);
  const durationMs = now - ride.boardedAtMs;
  const liveFare = ride.fareAt(now);

  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  return (
    <DrawerPage>
      <Box sx={{ px: 2, py: 1 }}>
        {/* Bus info */}
        <Box mb={1}>
          <BusInfo bus={ride.bus} />
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

        <Divider sx={{ my: 0.75 }} />

        {/* Next stop */}
        {nextArrival && (
          <>
            <Box mb={1}>
              <Box display="flex" alignItems="baseline" gap={1} mb={0.25}>
                <Typography variant="caption" color="text.secondary">
                  Next stop
                </Typography>
                <Typography
                  variant="caption"
                  color="primary.main"
                  sx={{ fontWeight: 600 }}
                >
                  {formatDurationSeconds(
                    Math.max(0, nextArrival.arrivalMs - now),
                  )}
                </Typography>
              </Box>
              <HaltInfo halt={nextArrival.halt} />
            </Box>
            <Divider sx={{ my: 0.75 }} />
          </>
        )}

        {/* Current stop (only shown when dwelling) */}
        {atHalt && (
          <>
            <Box mb={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 0.25 }}
              >
                Current stop
              </Typography>
              <HaltInfo halt={atHalt} />
            </Box>
            <Divider sx={{ my: 0.75 }} />
          </>
        )}

        {/* Duration + Fare */}
        <Box display="flex" gap={2} mb={1.5}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Duration
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatDurationSeconds(durationMs)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Fare
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              LKR {liveFare.toFixed(2)}
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
