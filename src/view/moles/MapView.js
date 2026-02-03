import { useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  useMap,
} from "react-leaflet";
import { Box } from "@mui/material";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LatLng from "../../nonview/base/LatLng";
import { useData } from "../../nonview/contexts/DataContext";
import Crosshairs from "../atoms/Crosshairs";
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
  const { routes, busHalts } = useData();
  const defaultZoom = 13;

  // Parse latLng from URL params and use ref to keep initial center stable
  const initialCenter = useRef(
    params.latLng
      ? LatLng.fromString(params.latLng).toArray()
      : LatLng.fromDefault().toArray(),
  );

  const handleMoveEnd = useCallback(
    (newLatLng) => {
      const currentLatLng = params.latLng;
      const newLatLngString = newLatLng.toString();

      // Only update if the latLng has changed
      if (currentLatLng !== newLatLngString) {
        navigate(`/map/${newLatLngString}`, { replace: true });
      }
    },
    [params.latLng, navigate],
  );

  // Convert route names to coordinates - memoized to prevent recreation
  const routesWithCoordinates = useMemo(() => {
    return routes.map((route) => {
      const coordinates = [];
      for (const haltName of route.halt_name_list) {
        const halt = busHalts.find((h) => h.name === haltName);
        if (halt && halt.latlng) {
          // Ensure coordinates are in the correct format [lat, lng]
          const latLng = Array.isArray(halt.latlng)
            ? halt.latlng
            : [halt.latlng.lat, halt.latlng.lng];
          coordinates.push(latLng);
        }
      }
      return { ...route, coordinates };
    });
  }, [routes, busHalts]);

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
        />
        <MapController onMoveEnd={handleMoveEnd} />

        {/* Render all routes */}
        {routesWithCoordinates.map((route) => {
          return route.coordinates.length > 0 ? (
            <Polyline
              key={route.route_num}
              positions={route.coordinates}
              color="blue"
              weight={5}
              opacity={0.5}
              eventHandlers={{
                click: () => {
                  navigate(`/route/${encodeURIComponent(route.route_num)}`);
                },
              }}
            />
          ) : null;
        })}

        {/* Render all bus halts as circles */}
        {busHalts.map((halt, index) => {
          if (!halt.latLng) return null;
          const position = Array.isArray(halt.latLng)
            ? halt.latLng
            : [halt.latLng.lat, halt.latLng.lng];
          return (
            <CircleMarker
              key={halt.name}
              center={position}
              radius={5}
              fillColor="red"
              fillOpacity={0.8}
              color="darkred"
              weight={2}
              eventHandlers={{
                click: () => {
                  navigate(`/bus_halt/${encodeURIComponent(halt.name)}`);
                },
              }}
            />
          );
        })}
      </MapContainer>
      <Crosshairs />
    </Box>
  );
}
