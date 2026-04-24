import { Box, Typography } from "@mui/material";

export default function NumberPlate({ bus }) {
  const color = bus.route.getColor();
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 0.75,
        py: 0.1,
        borderRadius: 1,
        border: "1.5px solid",
        borderColor: color,
        color,
        fontFamily: "monospace",
        fontSize: "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        lineHeight: 1.5,
        whiteSpace: "nowrap",
      }}
    >
      {bus.numberPlate}
    </Box>
  );
}
