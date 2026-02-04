import { Box, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";

export default function HaltView({ halt }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{
        py: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <PlaceIcon fontSize="small" />
      <Typography variant="body1">{halt.name}</Typography>
    </Box>
  );
}
