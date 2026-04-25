import { Circle, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import L from "leaflet";

function getCrosshairLatLng(map) {
  const size = map.getSize();
  return map.containerPointToLatLng(L.point(size.x / 2, size.y * 0.25));
}

export default function Crosshairs() {
  const map = useMap();
  const [center, setCenter] = useState(() => getCrosshairLatLng(map));

  useEffect(() => {
    const updateCenter = () => {
      setCenter(getCrosshairLatLng(map));
    };

    map.on("moveend", updateCenter);
    return () => {
      map.off("moveend", updateCenter);
    };
  }, [map]);

  const centerPosition = [center.lat, center.lng];

  return (
    <>
      {/* 1 km circle */}
      <Circle
        center={centerPosition}
        radius={1000}
        pathOptions={{
          color: "#404040",
          weight: 2,
          fillColor: "transparent",
          opacity: 0.5,
        }}
      />
      {/* 500 m circle */}
      <Circle
        center={centerPosition}
        radius={500}
        pathOptions={{
          color: "#404040",
          weight: 2,
          fillColor: "transparent",
          opacity: 0.6,
        }}
      />
    </>
  );
}

export function CrosshairsOverlay() {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "25%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 10000,
      }}
    >
      {/* Vertical line */}
      <Box
        sx={{
          position: "absolute",
          width: "2px",
          height: "40px",
          backgroundColor: "rgba(64, 64, 64, 0.8)",
          left: "50%",
          top: "-20px",
          transform: "translateX(-50%)",
        }}
      />
      {/* Horizontal line */}
      <Box
        sx={{
          position: "absolute",
          height: "2px",
          width: "40px",
          backgroundColor: "rgba(64, 64, 64, 0.8)",
          top: "50%",
          left: "-20px",
          transform: "translateY(-50%)",
        }}
      />
    </Box>
  );
}
