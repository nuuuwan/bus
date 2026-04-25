import { Box } from "@mui/material";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";

export default function NumberPlate({ bus, atHalt = false }) {
  const color = bus.route.getColor();
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.4,
        px: 0.75,
        py: 0.1,
        borderRadius: 1,
        border: "1.5px solid",
        borderColor: atHalt ? "success.main" : color,
        color: atHalt ? "success.main" : color,
        fontFamily: "monospace",
        fontSize: "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        lineHeight: 1.5,
        whiteSpace: "nowrap",
      }}
    >
      <AirportShuttleIcon sx={{ fontSize: "0.9rem" }} />
      {bus.route.shortLabel} · {bus.numberPlate}
      {atHalt && (
        <Box
          component="span"
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "success.main",
            flexShrink: 0,
          }}
        />
      )}
    </Box>
  );
}
