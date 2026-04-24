import {
  Box,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
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
        let approachArrow = null;
        if (currentLatLng && busLatLng) {
          const futureLatLng = bus.latLngAt(now + 15_000);
          if (futureLatLng) {
            const distFuture = currentLatLng.distanceTo(futureLatLng);
            approachArrow = distFuture < distanceKm ? "up" : "down";
          }
        }
        return { bus, busLatLng, distanceKm, approachArrow };
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
    <Box display="flex" flexDirection="column" height="100vh">
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ px: 2, pt: 1, pb: 0.5, display: "block", flexShrink: 0 }}
      >
        {busItems.length} buses
      </Typography>
      <Divider />
      <Box width="100%" overflow="auto" flexGrow={1}>
        <List sx={{ p: 0 }}>
          {busItems.map(({ bus, distanceKm, approachArrow }) => {
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
                    gap: 1.5,
                  }}
                  divider
                >
                  <Box flex={1} minWidth={0}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <NumberPlate bus={bus} />
                      {approachArrow === "up" && (
                        <ArrowUpwardIcon
                          sx={{ fontSize: 16, color: "success.main" }}
                        />
                      )}
                      {approachArrow === "down" && (
                        <ArrowDownwardIcon
                          sx={{ fontSize: 16, color: "error.main" }}
                        />
                      )}
                    </Box>
                    <Box mt={0.5}>
                      <Distance
                        distanceKm={distanceKm === Infinity ? null : distanceKm}
                      />
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
