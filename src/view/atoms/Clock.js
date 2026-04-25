import { Box, Typography } from "@mui/material";
import { useClock } from "../../nonview/contexts/ClockContext";

const SIM_SPEED = 10;
const START_REAL_MS = Date.now();
const START_SIM_MS = Date.now();

export default function Clock() {
  const nowMs = useClock();
  const simNow = new Date(START_SIM_MS + (nowMs - START_REAL_MS) * SIM_SPEED);

  const time = simNow.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 1000,
        backgroundColor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(4px)",
        borderRadius: 1,
        px: 1.5,
        py: 0.5,
        boxShadow: 2,
        pointerEvents: "none",
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontFamily: "monospace", fontWeight: "bold", letterSpacing: 1 }}
      >
        {time}
      </Typography>
    </Box>
  );
}
