import { useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
}) {
  const map = useMap();
  const { latLngId } = useParams();

  // Expose fly-to function via ref for imperative use (e.g. location button)
  useEffect(() => {
    if (flyToRef) {
      flyToRef.current = (lat, lng, zoom) => {
        map.flyTo([lat, lng], zoom, { duration: 1 });
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

  // Handle URL changes (like "Current Location" button)
  useEffect(() => {
    if (latLngId) {
      const latLng = LatLng.fromString(latLngId);
      const currentCenter = map.getCenter();

      // Only fly if the URL is significantly different from the current view
      if (
        currentCenter.lat !== latLng.lat ||
        currentCenter.lng !== latLng.lng
      ) {
        map.setView([latLng.lat, latLng.lng], map.getZoom());
      }
    }
  }, [latLngId, map]);

  // Handle User Drags
  useEffect(() => {
    const onMapMove = () => {
      const center = map.getCenter();
      onMoveEnd(new LatLng(center.lat, center.lng));
    };

    map.on("moveend", onMapMove);
    return () => map.off("moveend", onMapMove);
  }, [map, onMoveEnd]);

  return null;
}

export default function MapView() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    routes,
    halts,
    buses,
    selectedBus,
    selectedHalt,
    selectedRoute,
    currentLatLng,
  } = useData();
  const { now } = useClock();
  const defaultZoom = 16;
  const flyToRef = useRef(null);

  // Parse latLng from URL params and use ref to keep initial center stable
  const initialCenter = useRef(
    params.latLngId
      ? LatLng.fromString(params.latLngId).toArray()
      : LatLng.fromDefault().toArray(),
  );

  const handleMoveEnd = useCallback(
    (newLatLng) => {
      const currentLatLng = params.latLngId;
      const newLatLngString = newLatLng.toString();

      // Only update if the latLng has changed
      if (currentLatLng !== newLatLngString) {
        // Preserve the current route structure (e.g., /halts, /routes, /route/123, /halt/456)
        // Extract everything after the latLngId
        const pathSuffix = location.pathname.replace(/^\/[^/]+/, "");
        navigate(`/${newLatLngString}${pathSuffix}`, { replace: true });
      }
    },
    [params.latLngId, location.pathname, navigate],
  );

  const handleCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLatLng = new LatLng(latitude, longitude);
          // Fly the map immediately
          if (flyToRef.current) {
            flyToRef.current(latitude, longitude, defaultZoom);
          }
          // Update URL (preserves drawer path suffix)
          const pathSuffix = location.pathname.replace(/^\/[^/]+/, "");
          navigate(`/${newLatLng.toString()}${pathSuffix}`, { replace: true });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }
  }, [navigate, location.pathname, defaultZoom]);

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
