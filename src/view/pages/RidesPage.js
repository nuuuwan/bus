import { Box, Divider, List, ListItem, Typography } from "@mui/material";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useData } from "../../nonview/contexts/DataContext";
import { formatDuration } from "../../nonview/base/Duration";
import NumberPlate from "../atoms/NumberPlate";
import HaltInfo from "../atoms/HaltInfo";

export default function RidesPage() {
  const { rideHistory, ride } = useData();

  const allRides = [...(ride ? [ride] : []), ...[...rideHistory].reverse()];

  if (allRides.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="80%"
        gap={1}
      >
        <AirportShuttleIcon sx={{ fontSize: 40, color: "text.disabled" }} />
        <Typography variant="body2" color="text.secondary">
          No rides yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ px: 2, pt: 1, pb: 0.5, display: "block", flexShrink: 0 }}
      >
        {allRides.length} ride{allRides.length !== 1 ? "s" : ""}
      </Typography>
      <Box width="100%" overflow="auto" flexGrow={1}>
        <List sx={{ p: 0 }}>
          {allRides.map((r, i) => (
            <ListItem
              key={i}
              divider
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                py: 1.5,
                px: 2,
                gap: 0.5,
              }}
            >
              {/* Bus */}
              <NumberPlate bus={r.bus} />

              {/* From → To */}
              <Box
                display="flex"
                alignItems="center"
                gap={0.5}
                flexWrap="wrap"
                mt={0.25}
              >
                <HaltInfo halt={r.boardedAtHalt} />
                {r.alightedAtHalt && (
                  <>
                    <ArrowForwardIcon
                      sx={{ fontSize: 14, color: "text.secondary" }}
                    />
                    <HaltInfo halt={r.alightedAtHalt} />
                  </>
                )}
              </Box>

              {/* Duration + fare */}
              <Box display="flex" gap={2} mt={0.25}>
                <Typography variant="caption" color="text.secondary">
                  {formatDuration(r.durationMs())}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  LKR {r.fare.toFixed(2)}
                </Typography>
                {r.isActive && (
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{ fontWeight: 600 }}
                  >
                    Active
                  </Typography>
                )}
              </Box>
              <Divider />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
