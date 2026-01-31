import { Box } from "@mui/material";

export default function Crosshairs() {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 10000,
      }}
    >
      {/* Vertical line */}
      <Box
        sx={{
          position: "absolute",
          width: "2px",
          height: "40px",
          backgroundColor: "rgba(64, 64, 64, 0.8)",
          left: "50%",
          top: "-20px",
          transform: "translateX(-50%)",
        }}
      />
      {/* Horizontal line */}
      <Box
        sx={{
          position: "absolute",
          height: "2px",
          width: "40px",
          backgroundColor: "rgba(64, 64, 64, 0.8)",
          top: "50%",
          left: "-20px",
          transform: "translateY(-50%)",
        }}
      />
    </Box>
  );
}
