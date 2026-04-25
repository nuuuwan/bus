import { CircularProgress, Box, List, Typography } from "@mui/material";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../../nonview/contexts/DataContext";
import RouteLink from "../moles/RouteLink";
import DrawerPage from "../moles/DrawerPage";

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
            halt.latLng && currentLatLng.distanceTo(halt.latLng) <= NEARBY_KM,
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
    <DrawerPage
      subheader={
        <Typography variant="caption" color="text.secondary">
          {nearbyCount} routes within 1km
        </Typography>
      }
    >
      <List sx={{ p: 0 }}>
        <AnimatePresence>
            {sortedRoutes.map((route) => {
              const isNearby =
                !currentLatLng ||
                route.haltList.some(
                  (halt) =>
                    halt.latLng &&
                    currentLatLng.distanceTo(halt.latLng) <= NEARBY_KM,
                );
              return (
                <motion.div
                  key={`${route.routeNum}-${route.direction}`}
                  layout
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  style={{ opacity: isNearby ? 1 : 0.25 }}
                >
                  <RouteLink route={route} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </List>
    </DrawerPage>
  );
}
