import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItemButton,
  Button,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import { useNavigate, useLocation } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import { useClock } from "../../nonview/contexts/ClockContext";
import { formatArrival } from "../../nonview/base/Duration";
import Distance from "../atoms/Distance";
import BusInfo from "../atoms/BusInfo";

export default function HaltPage() {
  const {
    selectedHalt,
    routes,
    buses,
    currentLatLng,
    loading,
    ride,
    boardBus,
  } = useData();
  const now = useClock();
  const navigate = useNavigate();
  const location = useLocation();

  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  // Distance from user to the selected halt
  const haltDistanceKm =
    currentLatLng && selectedHalt?.latLng
      ? currentLatLng.distanceTo(selectedHalt.latLng)
      : null;

  // Flat list of all buses serving this halt, sorted by next arrival
  const busItems = selectedHalt?.latLng
    ? routes
        .filter((route) => route.hasHalt(selectedHalt))
        .flatMap((route) => buses.filter((b) => b.route.id === route.id))
        .map((bus) => ({
          bus,
          arrivalMs: bus.nextArrivalAt(selectedHalt.latLng, now),
        }))
        .sort((a, b) => a.arrivalMs - b.arrivalMs)
    : [];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedHalt) {
    return (
      <Box p={3}>
        <Typography variant="h5">Halt not found</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {haltDistanceKm !== null && (
        <Box sx={{ px: 2, pt: 1, pb: 0.5, flexShrink: 0 }}>
          <Distance distanceKm={haltDistanceKm} />
        </Box>
      )}
      <Box width="100%" overflow="auto" flexGrow={1}>
        <List sx={{ p: 0 }}>
          {busItems.map(({ bus, arrivalMs }) => {
            const busAtThisHalt =
              selectedHalt && bus.currentHalt(now)?.id === selectedHalt.id;
            const canBoard = busAtThisHalt && !ride;
            return (
              <ListItemButton
                key={bus.id}
                divider
                onClick={() =>
                  navigate(`/${latLng}/bus/${encodeURIComponent(bus.id)}`)
                }
                sx={{
                  py: 1.5,
                  px: 2,
                  gap: 1,
                }}
              >
                <BusInfo bus={bus} />
                {busAtThisHalt ? (
                  canBoard ? (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<DirectionsBusIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        boardBus(bus, selectedHalt);
                      }}
                      sx={{ ml: "auto", textTransform: "none", flexShrink: 0 }}
                    >
                      Get On
                    </Button>
                  ) : (
                    <Typography
                      variant="caption"
                      color="success.dark"
                      sx={{ ml: "auto", fontWeight: 600, flexShrink: 0 }}
                    >
                      Boarding
                    </Typography>
                  )
                ) : (
                  <>
                    <AccessTimeIcon
                      sx={{ fontSize: 14, ml: "auto" }}
                      color="action"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatArrival(arrivalMs, now)}
                    </Typography>
                  </>
                )}
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
