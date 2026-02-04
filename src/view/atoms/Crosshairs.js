import { Circle, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";

export default function Crosshairs() {
  const map = useMap();
  const [center, setCenter] = useState(map.getCenter());

  useEffect(() => {
    const updateCenter = () => {
      setCenter(map.getCenter());
    };

    map.on("move", updateCenter);
    return () => {
      map.off("move", updateCenter);
    };
  }, [map]);

  // Walking speed: 4 kmph
  // 5 min = 0.333 km = 333 m
  // 10 min = 0.667 km = 667 m
  const centerPosition = [center.lat, center.lng];

  return (
    <>
      {/* 10 min circle (667m) */}
      <Circle
        center={centerPosition}
        radius={667}
        pathOptions={{
          color: "#404040",
          weight: 2,
          fillColor: "transparent",
          opacity: 0.5,
        }}
      />
      {/* 5 min circle (333m) */}
      <Circle
        center={centerPosition}
        radius={333}
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
        top: "50%",
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
