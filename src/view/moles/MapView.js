import { useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMap,
} from "react-leaflet";
import { Box, IconButton } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import PlaceIcon from "@mui/icons-material/Place";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import LatLng from "../../nonview/base/LatLng";
import { useData } from "../../nonview/contexts/DataContext";
import Crosshairs, { CrosshairsOverlay } from "../atoms/Crosshairs";
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
  const { routes, halts } = useData();
  const defaultZoom = 16;

  // Check if we're on a route or halt page
  const selectedRouteId = params.routeId;
  const selectedHaltId = params.haltId;
  const isOnRoutePage = !!selectedRouteId;
  const isOnHaltPage = !!selectedHaltId;

  // Create custom icon for halts
  // If on halt page: selected = black, others = white
  // If NOT on halt page: all = black
  const createHaltIcon = (isSelected) => {
    let color = "black"; // Default: black for all halts
    if (isOnHaltPage && !isSelected) {
      color = "white"; // Only show white for non-selected when on halt page
    }
    return L.divIcon({
      className: "custom-halt-icon",
      html: renderToStaticMarkup(
        <PlaceIcon style={{ color, fontSize: "32px" }} />,
      ),
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  };

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

        {routes.map((route) => {
          const isSelected = selectedRouteId === encodeURIComponent(route.id);
          // If on route page: selected = route color, others = white
          // If NOT on route page: all = their colors
          let color = route.getColor(); // Default: show route color
          if (isOnRoutePage && !isSelected) {
            color = "white"; // Only show white for non-selected when on route page
          }
          return (
            <Polyline
              key={`${route.routeNum}-${route.direction}`}
              positions={route.latLngList.map((latLng) => latLng.toArray())}
              color={color}
              weight={3}
              opacity={1}
              eventHandlers={{
                click: () => {
                  const latLng = params.latLngId || "";
                  navigate(`/${latLng}/route/${encodeURIComponent(route.id)}`);
                },
              }}
            />
          );
        })}

        {halts
          .filter((halt) => routes.some((route) => route.hasHalt(halt)))
          .map((halt) => {
            const isSelected = selectedHaltId === encodeURIComponent(halt.id);
            return (
              <Marker
                key={halt.name}
                position={
                  halt.latLng ? [halt.latLng.lat, halt.latLng.lng] : null
                }
                icon={createHaltIcon(isSelected)}
                eventHandlers={{
                  click: () => {
                    const latLng = params.latLngId || "";
                    navigate(`/${latLng}/halt/${encodeURIComponent(halt.id)}`);
                  },
                }}
              />
            );
          })}

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
