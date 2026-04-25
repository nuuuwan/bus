import {
  Box,
  CircularProgress,
  Divider,
  List,
  Typography,
} from "@mui/material";
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

  const NEARBY_KM = 1;
  const nearbyCount = currentLatLng
    ? sortedRoutes.filter((route) =>
        route.haltList.some(
          (halt) =>
            halt.latLng &&
            currentLatLng.distanceTo(halt.latLng) <= NEARBY_KM,
        ),
      ).length
    : sortedRoutes.length;

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
    <Box display="flex" flexDirection="column" height="100vh">
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ px: 2, pt: 1, pb: 0.5, display: "block", flexShrink: 0 }}
      >
        {nearbyCount} routes within 1km
      </Typography>
      <Divider />
      <Box width="100%" overflow="auto" flexGrow={1}>
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
