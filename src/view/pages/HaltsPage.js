import { Box, CircularProgress, List } from "@mui/material";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../../nonview/contexts/DataContext";
import HaltLink from "../moles/HaltLink";

export default function HaltsPage() {
  const { halts, routes, buses, currentLatLng, loading } = useData();

  // Filter halts to only show those associated with at least one route
  const filteredHalts = halts.filter((halt) =>
    routes.some((route) => route.hasHalt(halt)),
  );

  // Sort by distance if currentLatLng is available
  const sortedHalts = currentLatLng
    ? [...filteredHalts].sort((a, b) => {
        const distA = a.latLng ? currentLatLng.distanceTo(a.latLng) : Infinity;
        const distB = b.latLng ? currentLatLng.distanceTo(b.latLng) : Infinity;
        return distA - distB;
      })
    : filteredHalts;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentLatLng]);

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
        <List sx={{ p: 1, m: 1 }}>
          <AnimatePresence>
            {sortedHalts.map((halt) => (
              <motion.div
                key={halt.name}
                layout
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <HaltLink halt={halt} buses={buses} />
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
      </Box>
    </Box>
  );
}
