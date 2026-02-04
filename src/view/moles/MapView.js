import { useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  useMap,
} from "react-leaflet";
import { Box, IconButton } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import "leaflet/dist/leaflet.css";
import L, { latLng } from "leaflet";
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

  useEffect(() => {
    map.on("moveend", () => {
      const mapCenter = map.getCenter();
      const newLatLng = new LatLng(mapCenter.lat, mapCenter.lng);
      onMoveEnd(newLatLng);
    });

    return () => {
      map.off("moveend");
    };
  }, [map, onMoveEnd]);

  return null;
}

export default function MapView() {
  const params = useParams();
  const navigate = useNavigate();
  const { routes, halts } = useData();
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
        navigate(`/${newLatLngString}`, { replace: true });
      }
    },
    [params.latLngId, navigate],
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

  console.log(halts.length);

  return (
    <Box sx={{ position: "relative", height: "100vh", width: "100%" }}>
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
          <Polyline
            key={`${route.routeNum}-${route.direction}`}
            positions={route.latLngList.map((latLng) => latLng.toArray())}
            color={route.getColor()}
            weight={3}
            opacity={1}
            eventHandlers={{
              click: () => {
                const latLng = params.latLngId || "";
                navigate(`/${latLng}/route/${encodeURIComponent(route.id)}`);
              },
            }}
          />
        ))}

        {halts.map((halt) => (
          <CircleMarker
            key={halt.name}
            center={halt.latLng ? [halt.latLng.lat, halt.latLng.lng] : null}
            radius={5}
            fillColor="white"
            fillOpacity={1}
            color="black"
            weight={3}
            eventHandlers={{
              click: () => {
                const latLng = params.latLngId || "";
                navigate(`/${latLng}/halt/${encodeURIComponent(halt.id)}`);
              },
            }}
          />
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
