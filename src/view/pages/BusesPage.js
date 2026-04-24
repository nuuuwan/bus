import {
  Box,
  CircularProgress,
  List,
  ListItemButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import { useClock } from "../../nonview/contexts/ClockContext";
import Distance from "../atoms/Distance";
import NumberPlate from "../atoms/NumberPlate";

export default function BusesPage() {
  const { buses, currentLatLng, loading } = useData();
  const now = useClock();
  const navigate = useNavigate();
  const location = useLocation();

  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  // Sort buses by physical distance from the user to the bus's current position.
  const busItems = (() => {
    return buses
      .map((bus) => {
        const busLatLng = bus.latLngAt(now);
        const distanceKm =
          currentLatLng && busLatLng
            ? currentLatLng.distanceTo(busLatLng)
            : Infinity;
        return { bus, busLatLng, distanceKm };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  })();

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
          {busItems.map(({ bus, distanceKm }) => {
            return (
              <motion.div
                key={bus.id}
                layout
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <ListItemButton
                  onClick={() =>
                    navigate(`/${latLng}/bus/${encodeURIComponent(bus.id)}`)
                  }
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    gap: 1.5,
                  }}
                >
                  <Box flex={1} minWidth={0}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <NumberPlate bus={bus} />
                    </Box>
                    <Box mt={0.5}>
                      <Distance distanceKm={distanceKm === Infinity ? null : distanceKm} />
                    </Box>
                  </Box>
                </ListItemButton>
              </motion.div>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
