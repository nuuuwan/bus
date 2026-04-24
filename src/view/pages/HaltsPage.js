import { Box, CircularProgress, Divider, List, Typography } from "@mui/material";
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
    <Box display="flex" flexDirection="column" height="100vh">
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ px: 2, pt: 1, pb: 0.5, display: "block", flexShrink: 0 }}
      >
        {sortedHalts.length} halts
      </Typography>
      <Divider />
      <Box width="100%" overflow="auto" flexGrow={1}>
        <List sx={{ p: 0 }}>
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
