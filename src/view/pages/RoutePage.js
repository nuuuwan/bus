import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  ListItemIcon,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import { Link } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";

export default function RoutePage() {
  const { selectedRoute, loading } = useData();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedRoute) {
    return (
      <Box p={3}>
        <Typography variant="h5">Route not found</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" height="100vh">
      <Box width="100%" overflow="auto" p={2}>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <DirectionsBusIcon color="primary" fontSize="large" />
            <Typography variant="h5">{selectedRoute.routeNum}</Typography>
          </Box>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Halts ({selectedRoute.haltList.length})
          </Typography>
        </Paper>
        <Paper elevation={3}>
          <List>
            {selectedRoute.haltList.map((halt, index) => (
              <ListItem
                key={index}
                component={Link}
                to={`/halt/${encodeURIComponent(halt.id)}`}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemIcon>
                  <PlaceIcon />
                </ListItemIcon>
                <ListItemText primary={`${index + 1}. ${halt.name}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
}
