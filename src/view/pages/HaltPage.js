import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PlaceIcon from "@mui/icons-material/Place";
import { Link } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";

export default function HaltPage() {
  const { selectedHalt, routes, loading } = useData();

  // Find all routes that include this bus halt
  const routesForHalt = selectedHalt
    ? routes.filter((route) => route.hasHalt(selectedHalt))
    : [];

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

  if (!selectedHalt) {
    return (
      <Box p={3}>
        <Typography variant="h5">Halt not found</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" height="100vh">
      <Box width="100%" overflow="auto" p={2}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PlaceIcon color="error" fontSize="large" />
            <Typography variant="h5">{selectedHalt.name}</Typography>
          </Box>
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
            {selectedHalt.latLng.toString()}
          </Typography>
        </Paper>

        {routesForHalt.length > 0 && (
          <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Routes ({routesForHalt.length})
            </Typography>
            <List>
              {routesForHalt.map((route) => (
                <ListItem
                  key={route.routeNum}
                  component={Link}
                  to={`/route/${encodeURIComponent(route.id)}`}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon>
                    <DirectionsBusIcon />
                  </ListItemIcon>
                  <ListItemText primary={route.id} />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
