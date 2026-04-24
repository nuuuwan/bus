import { Box, CircularProgress, List, Typography } from "@mui/material";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../../nonview/contexts/DataContext";
import RouteLink from "../moles/RouteLink";

export default function RoutesPage() {
  const { routes, currentLatLng, loading } = useData();

  // Sort by distance to closest halt if currentLatLng is available
  const sortedRoutes = currentLatLng
    ? [...routes].sort((a, b) => {
        const closestA =
          a.haltList.length > 0
            ? Math.min(
                ...a.haltList
                  .filter((halt) => halt.latLng)
                  .map((halt) => currentLatLng.distanceTo(halt.latLng)),
              )
            : Infinity;
        const closestB =
          b.haltList.length > 0
            ? Math.min(
                ...b.haltList
                  .filter((halt) => halt.latLng)
                  .map((halt) => currentLatLng.distanceTo(halt.latLng)),
              )
            : Infinity;
        return closestA - closestB;
      })
    : routes;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [sortedRoutes]);

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
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ px: 2, pt: 1, display: "block" }}
        >
          {sortedRoutes.length} routes
        </Typography>
        <List sx={{ p: 1, m: 1 }}>
          <AnimatePresence>
            {sortedRoutes.map((route) => (
              <motion.div
                key={`${route.routeNum}-${route.direction}`}
                layout
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <RouteLink route={route} />
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
      </Box>
    </Box>
  );
}
