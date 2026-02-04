import { useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import { Box, IconButton } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LatLng from "../../nonview/base/LatLng";
import { useData } from "../../nonview/contexts/DataContext";
import Crosshairs, { CrosshairsOverlay } from "../atoms/Crosshairs";
import RoutePolyline from "../atoms/RoutePolyline";
import HaltMarker from "../atoms/HaltMarker";
// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function MapController({ onMoveEnd }) {
  const map = useMap();
  const { latLngId } = useParams();

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
  const { routes, halts, selectedHalt, selectedRoute, currentLatLng } =
    useData();
  const defaultZoom = 16;

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
          const newLatLng = new LatLng(
            position.coords.latitude,
            position.coords.longitude,
          );
          navigate(`/${newLatLng.toString()}`, { replace: true });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }
  }, [navigate]);

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
        <MapController onMoveEnd={handleMoveEnd} />

        {routes.map((route) => (
          <RoutePolyline key={route.id} route={route} />
        ))}

        {halts
          .filter((halt) => routes.some((route) => route.hasHalt(halt)))
          .map((halt) => (
            <HaltMarker key={halt.id} halt={halt} />
          ))}

        {dottedLinePositions && (
          <Polyline
            positions={dottedLinePositions}
            color="black"
            weight={2}
            opacity={0.7}
            dashArray="5, 10"
          />
        )}

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
