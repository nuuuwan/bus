import { Box, Button, Chip, ListItemButton, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import { useNavigate, useLocation } from "react-router-dom";
import { useClock } from "../../nonview/contexts/ClockContext";
import { useData } from "../../nonview/contexts/DataContext";
import { formatArrival } from "../../nonview/base/Duration";
import NumberPlate from "../atoms/NumberPlate";
import HaltInfo from "../atoms/HaltInfo";

export default function HaltLink({ halt, buses = [], nextBus, simple }) {
  const location = useLocation();
  const navigate = useNavigate();
  const now = useClock();
  const { ride, boardBus } = useData();

  // Extract latLng from current pathname
  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  // When nextBus isn't explicitly passed, find the soonest bus from `buses`
  const resolvedNextBus =
    nextBus ??
    (halt.latLng && buses.length > 0
      ? buses
          .map((b) => ({
            bus: b,
            arrivalMs: b.nextArrivalAt(halt.latLng, now),
          }))
          .sort((a, b) => a.arrivalMs - b.arrivalMs)[0]
      : null);

  const busAtHalt =
    resolvedNextBus && resolvedNextBus.bus.currentHalt(now)?.id === halt.id
      ? resolvedNextBus.bus
      : null;
  const canBoard = busAtHalt && !ride;

  return (
    <ListItemButton
      divider
      onClick={() => navigate(`/${latLng}/halt/${encodeURIComponent(halt.id)}`)}
      sx={{ flexDirection: "column", alignItems: "flex-start", py: 1.5, px: 2 }}
    >
      <HaltInfo halt={halt} />
      {!simple && resolvedNextBus && (
        <Box
          display="flex"
          alignItems="center"
          gap={0.5}
          mt={0.5}
          flexWrap="wrap"
        >
          <NumberPlate bus={resolvedNextBus.bus} atHalt={!!busAtHalt} />
          {busAtHalt ? (
            <Chip
              label="Boarding"
              size="small"
              color="success"
              variant="outlined"
              sx={{ height: 18, fontSize: "0.65rem" }}
            />
          ) : (
            <>
              <AccessTimeIcon sx={{ fontSize: 13 }} color="action" />
              <Typography variant="caption" color="text.secondary">
                {formatArrival(resolvedNextBus.arrivalMs, now)}
              </Typography>
            </>
          )}
          {canBoard && (
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<DirectionsBusIcon sx={{ fontSize: 14 }} />}
              onClick={(e) => {
                e.stopPropagation();
                boardBus(busAtHalt, halt);
                navigate(`/${latLng}/ride`);
              }}
              sx={{
                textTransform: "none",
                py: 0,
                px: 1,
                fontSize: "0.7rem",
                minHeight: 24,
              }}
            >
              Get On
            </Button>
          )}
        </Box>
      )}
    </ListItemButton>
  );
}
