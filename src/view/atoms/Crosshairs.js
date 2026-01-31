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
        zIndex: 1000,
      }}
    >
      {/* Vertical line */}
      <Box
        sx={{
          position: "absolute",
          width: "1px",
          height: "40px",
          backgroundColor: "rgba(128, 128, 128, 0.5)",
          left: "50%",
          top: "-20px",
          transform: "translateX(-50%)",
        }}
      />
      {/* Horizontal line */}
      <Box
        sx={{
          position: "absolute",
          height: "1px",
          width: "40px",
          backgroundColor: "rgba(128, 128, 128, 0.5)",
          top: "50%",
          left: "-20px",
          transform: "translateY(-50%)",
        }}
      />
    </Box>
  );
}
