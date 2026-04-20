import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import { useNavigate, useLocation } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import { useClock } from "../../nonview/contexts/ClockContext";
import Distance from "../atoms/Distance";
import RouteIcon from "../atoms/RouteIcon";

export default function BusesPage() {
  const { buses, currentLatLng, loading } = useData();
  const now = useClock();
  const navigate = useNavigate();
  const location = useLocation();

  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  const sortedBuses = currentLatLng
    ? [...buses].sort((a, b) => {
        const posA = a.latLngAt(now);
        const posB = b.latLngAt(now);
        const distA = posA ? currentLatLng.distanceTo(posA) : Infinity;
        const distB = posB ? currentLatLng.distanceTo(posB) : Infinity;
        return distA - distB;
      })
    : buses;

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

  return (
    <Box display="flex" height="100vh">
      <Box width="100%" overflow="auto">
        <List sx={{ p: 0 }}>
          {sortedBuses.map((bus) => {
            const pos = bus.latLngAt(now);
            const distanceKm =
              currentLatLng && pos
                ? currentLatLng.distanceTo(pos)
                : null;

            return (
              <ListItem key={bus.id} disablePadding>
                <ListItemButton
                  onClick={() =>
                    navigate(
                      `/${latLng}/route/${encodeURIComponent(bus.route.id)}`,
                    )
                  }
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    gap: 1.5,
                  }}
                >
                  <AirportShuttleIcon
                    sx={{ color: bus.route.getColor(), flexShrink: 0 }}
                  />
                  <Box flex={1} minWidth={0}>
                    <RouteIcon route={bus.route} />
                    <Typography variant="caption" display="block" color="text.secondary">
                      Bus #{bus.busIndex + 1}
                    </Typography>
                    <Distance distanceKm={distanceKm} />
                  </Box>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
