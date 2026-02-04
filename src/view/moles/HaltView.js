import { Box, Typography, Paper } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";

export default function HaltView({ halt }) {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <PlaceIcon fontSize="large" />
        <Typography variant="h5">{halt.name}</Typography>
      </Box>
    </Paper>
  );
}
