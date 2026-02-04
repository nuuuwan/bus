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
          <Typography variant="h5" gutterBottom>
            {selectedRoute.routeNum}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Halts ({selectedRoute.haltNameList.length})
          </Typography>
        </Paper>
        <Paper elevation={3}>
          <List>
            {selectedRoute.haltNameList.map((halt, index) => (
              <ListItem
                key={index}
                component={Link}
                to={`/halt/${encodeURIComponent(halt)}`}
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
                <ListItemText primary={`${index + 1}. ${halt}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
}
