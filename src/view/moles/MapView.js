import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LatLng from "../../nonview/base/LatLng";

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function MapController({ center, onMoveEnd }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

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
  const defaultZoom = 13;

  // Parse latLng from URL params
  const center = params.latLng
    ? LatLng.fromString(params.latLng).toArray()
    : LatLng.fromDefault().toArray();

  const handleMoveEnd = (newLatLng) => {
    const currentLatLng = params.latLng;
    const newLatLngString = newLatLng.toString();

    // Only update if the latLng has changed
    if (currentLatLng !== newLatLngString) {
      navigate(`/map/${newLatLngString}`, { replace: true });
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={defaultZoom}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController center={center} onMoveEnd={handleMoveEnd} />
    </MapContainer>
  );
}
