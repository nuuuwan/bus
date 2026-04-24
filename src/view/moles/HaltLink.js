import { Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";
import { useClock } from "../../nonview/contexts/ClockContext";
import Distance from "../atoms/Distance";
import RouteIcon from "../atoms/RouteIcon";

export default function HaltLink({ halt, buses = [] }) {
  const location = useLocation();
  const { currentLatLng, routes } = useData();
  const now = useClock();

  // Extract latLng from current pathname
  const match = location.pathname.match(/^\/([^/]+)/);
  const latLng = match ? match[1] : "";

  // Calculate distance if currentLatLng is available
  const distanceKm =
    currentLatLng && halt.latLng ? currentLatLng.distanceTo(halt.latLng) : null;

  // Find routes that serve this halt
  const servingRoutes = routes.filter((route) => route.hasHalt(halt));

  return (
    <Link
      to={`/${latLng}/halt/${encodeURIComponent(halt.id)}`}
      style={{ textDecoration: "none", width: "100%", color: "inherit" }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="body1">{halt.displayName}</Typography>
        <Distance distanceKm={distanceKm} />
        {servingRoutes.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
            {servingRoutes.map((route) => {
              const routeBuses = buses.filter((b) => b.route.id === route.id);
              const nextArrivalMs =
                routeBuses.length > 0 && halt.latLng
                  ? Math.min(
                      ...routeBuses.map((b) =>
                        b.nextArrivalAt(halt.latLng, now),
                      ),
                    )
                  : null;
              const minsUntil =
                nextArrivalMs !== null
                  ? Math.max(0, Math.round((nextArrivalMs - now) / 60_000))
                  : null;
              return (
                <Box
                  key={route.id}
                  display="inline-flex"
                  alignItems="center"
                  gap={0.25}
                >
                  <RouteIcon route={route} />
                  {minsUntil !== null && (
                    <Typography variant="caption" color="text.secondary">
                      ({minsUntil === 0 ? "now" : `${minsUntil}m`})
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Link>
  );
}
