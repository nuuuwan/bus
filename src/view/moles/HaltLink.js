import { Box, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";

export default function HaltLink({ halt }) {
  return (
    <Box display="flex" alignItems="center" gap={1} sx={{}}>
      <Typography variant="body1">{halt.displayName}</Typography>
    </Box>
  );
}
