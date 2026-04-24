import { Box, Typography } from "@mui/material";
import { useClock } from "../../nonview/contexts/ClockContext";

export default function Clock() {
  const nowMs = useClock();
  const now = new Date(nowMs);

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 72,
        left: 16,
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
