import { useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import { useClock } from "../../nonview/contexts/ClockContext";
import { Box, IconButton } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LatLng from "../../nonview/base/LatLng";
import { useData } from "../../nonview/contexts/DataContext";
import Crosshairs, { CrosshairsOverlay } from "../atoms/Crosshairs";
import RoutePolyline from "../atoms/RoutePolyline";
import HaltMarker from "../atoms/HaltMarker";
import BusMarker from "../atoms/BusMarker";
// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function MapController({
  onMoveEnd,
  flyToRef,
  selectedBus,
  selectedHalt,
  now,
  latLngId,
  ride,
}) {
  const map = useMap();

  // Expose fly-to function via ref for imperative use (e.g. location button).
  // yOffsetPx shifts the map center downward so the target appears
  // at the visual centre of the visible area (e.g. above bottom drawer).
  useEffect(() => {
    if (flyToRef) {
      flyToRef.current = (lat, lng, zoom, yOffsetPx = 0) => {
        if (yOffsetPx !== 0) {
          const targetPt = map.project([lat, lng], zoom);
          const adjustedLatLng = map.unproject(
            L.point(targetPt.x, targetPt.y + yOffsetPx),
            zoom,
          );
          map.flyTo(adjustedLatLng, zoom, { duration: 1 });
        } else {
          map.flyTo([lat, lng], zoom, { duration: 1 });
        }
      };
    }
  }, [map, flyToRef]);

  // Fly to selected bus or halt
  useEffect(() => {
    if (selectedBus && now !== undefined) {
      const pos = selectedBus.latLngAt(now);
      if (pos) {
        map.flyTo([pos.lat, pos.lng], 16, { duration: 1 });
      }
    } else if (selectedHalt?.latLng) {
      map.flyTo([selectedHalt.latLng.lat, selectedHalt.latLng.lng], 16, {
        duration: 1,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBus?.id, selectedHalt?.id]);

  // Handle URL changes (like "Current Location" button) — skip when riding.
  // The URL stores the crosshair lat/lng (25% y), so when repositioning we
  // must offset the map centre so that lat/lng lands at the crosshair, not
  // at the geographic centre (50% y). We compare against the current
  // crosshair position (not map.getCenter()) to avoid a feedback loop where
  // the drag-triggered URL update re-fires a setView.
  useEffect(() => {
    if (ride) return;
    if (!latLngId) return;
    const targetLL = LatLng.fromString(latLngId);
    const size = map.getSize();
    const crosshairLL = map.containerPointToLatLng(
      L.point(size.x / 2, size.y * 0.25),
    );
    const EPS = 1e-5;
    if (
      Math.abs(crosshairLL.lat - targetLL.lat) < EPS &&
      Math.abs(crosshairLL.lng - targetLL.lng) < EPS
    ) {
      return; // crosshair already at target — drag just updated the URL, no-op
    }
    // Position map so targetLL appears at the crosshair (25% y)
    const zoom = map.getZoom();
    const targetPt = map.project([targetLL.lat, targetLL.lng], zoom);
    const adjustedCenter = map.unproject(
      L.point(targetPt.x, targetPt.y + size.y * 0.25),
      zoom,
    );
    map.flyTo(adjustedCenter, zoom, { duration: 0.5 });
  }, [latLngId, map, ride]);

  // Continuously follow the bus while the user is riding
  useEffect(() => {
    if (!ride) return;
    const pos = ride.bus.latLngAt(now);
    if (pos) {
      // Offset so the bus lands at the crosshair (25% y), not the map centre (50% y)
      const zoom = map.getZoom();
      const size = map.getSize();
      const targetPt = map.project([pos.lat, pos.lng], zoom);
      const adjustedCenter = map.unproject(
        L.point(targetPt.x, targetPt.y + size.y * 0.25),
        zoom,
      );
      map.panTo(adjustedCenter, { animate: true, duration: 0.9 });
    }
  }, [ride, now, map]);

  // Handle User Drags
  useEffect(() => {
    const onMapMove = () => {
      const size = map.getSize();
      const crosshairLatLng = map.containerPointToLatLng(
        L.point(size.x / 2, size.y * 0.25),
      );
      onMoveEnd(new LatLng(crosshairLatLng.lat, crosshairLatLng.lng));
    };

    map.on("moveend", onMapMove);
    return () => map.off("moveend", onMapMove);
  }, [map, onMoveEnd]);

  return null;
}

export default function MapView() {
  const navigate = useNavigate();
  const location = useLocation();
  // Parse latLngId directly from the URL path — useParams() is not available
  // here because MapView renders outside any <Route> element.
  const latLngId = location.pathname.split("/").filter(Boolean)[0] || null;
  const {
    routes,
    halts,
    buses,
    selectedBus,
    selectedHalt,
    selectedRoute,
    currentLatLng,
    ride,
  } = useData();
  const now = useClock();
  const defaultZoom = 16;
  const flyToRef = useRef(null);

  // Parse latLng from URL and use ref to keep initial center stable
  const initialCenter = useRef(
    latLngId
      ? LatLng.fromString(latLngId).toArray()
      : LatLng.fromDefault().toArray(),
  );

  const handleMoveEnd = useCallback(
    (newLatLng) => {
      // While riding, the map follows the bus automatically — don't let
      // map-pan moveend events overwrite the URL with crosshair offsets.
      if (ride) return;
      const newLatLngString = newLatLng.toString();

      // Only update if the latLng has changed
      if (latLngId !== newLatLngString) {
        // Preserve the current route structure (e.g., /halts, /routes, /route/123, /halt/456)
        // Extract everything after the latLngId
        const pathSuffix = location.pathname.replace(/^\/[^/]+/, "");
        navigate(`/${newLatLngString}${pathSuffix}`, { replace: true });
      }
    },
    [latLngId, location.pathname, navigate, ride],
  );

  // While riding, keep the URL latLng in sync with the bus position so that
  // if the user navigates away and back the map restores to the right spot.
  useEffect(() => {
    if (!ride || !currentLatLng) return;
    const newLatLngString = currentLatLng.toString();
    if (latLngId === newLatLngString) return;
    const pathSuffix = location.pathname.replace(/^\/[^/]+/, "");
    navigate(`/${newLatLngString}${pathSuffix}`, { replace: true });
  }, [ride, currentLatLng, latLngId, location.pathname, navigate]);

  const handleCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLatLng = new LatLng(latitude, longitude);
          // Just update the URL — the URL effect will fly the map so that
          // the location lands at the crosshair position (25% y).
          const pathSuffix = location.pathname.replace(/^\/[^/]+/, "");
          navigate(`/${newLatLng.toString()}${pathSuffix}`, { replace: true });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }
  }, [navigate, location.pathname]);

  // Calculate the target halt for the dotted line
  const targetHalt = selectedHalt
    ? selectedHalt
    : selectedRoute && currentLatLng
      ? selectedRoute.haltList
          .filter((halt) => halt.latLng)
          .reduce((closest, halt) => {
            if (!closest) return halt;
            const distToCurrent = currentLatLng.distanceTo(halt.latLng);
            const distToClosest = currentLatLng.distanceTo(closest.latLng);
            return distToCurrent < distToClosest ? halt : closest;
          }, null)
      : currentLatLng
        ? halts
            .filter(
              (halt) =>
                halt.latLng && routes.some((route) => route.hasHalt(halt)),
            )
            .reduce((closest, halt) => {
              if (!closest) return halt;
              const distToCurrent = currentLatLng.distanceTo(halt.latLng);
              const distToClosest = currentLatLng.distanceTo(closest.latLng);
              return distToCurrent < distToClosest ? halt : closest;
            }, null)
        : null;

  // Create dotted line coordinates
  const dottedLinePositions =
    targetHalt && currentLatLng && targetHalt.latLng
      ? [currentLatLng.toArray(), targetHalt.latLng.toArray()]
      : null;

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      <MapContainer
        center={initialCenter.current}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="grayscale-map"
        />
        <MapController
          onMoveEnd={handleMoveEnd}
          flyToRef={flyToRef}
          selectedBus={selectedBus}
          selectedHalt={selectedHalt}
          now={now}
          latLngId={latLngId}
          ride={ride}
        />

        {routes.map((route) => (
          <RoutePolyline key={route.id} route={route} />
        ))}

        {dottedLinePositions && (
          <Polyline
            positions={dottedLinePositions}
            color="black"
            weight={3}
            opacity={1}
            dashArray="5, 8"
          />
        )}

        {halts
          .filter((halt) => routes.some((route) => route.hasHalt(halt)))
          .map((halt) => (
            <HaltMarker key={halt.id} halt={halt} />
          ))}

        {buses.map((bus) => (
          <BusMarker key={bus.id} bus={bus} />
        ))}

        <Crosshairs />
      </MapContainer>
      <CrosshairsOverlay />
      <IconButton
        onClick={handleCurrentLocation}
        sx={{
          position: "absolute",
          bottom: 100,
          right: 16,
          backgroundColor: "white",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
          zIndex: 1000,
        }}
      >
        <MyLocationIcon />
      </IconButton>
    </Box>
  );
}
