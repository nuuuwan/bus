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
import { Link } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";

export default function BusHaltPage() {
  const { selectedBusHalt, routes, loading } = useData();

  // Find all routes that include this bus halt
  const routesForHalt = selectedBusHalt
    ? routes.filter((route) =>
        route.halt_name_list.includes(selectedBusHalt.name),
      )
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

  if (!selectedBusHalt) {
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
          <Typography variant="h5" gutterBottom>
            {selectedBusHalt.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Coordinates
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
            Latitude: {selectedBusHalt.latlng[0]}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
            Longitude: {selectedBusHalt.latlng[1]}
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
                  key={route.route_num}
                  component={Link}
                  to={`/route/${encodeURIComponent(route.route_num)}`}
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
                  <ListItemText primary={route.route_num} />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
