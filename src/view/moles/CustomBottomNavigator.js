import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import MapIcon from "@mui/icons-material/Map";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PlaceIcon from "@mui/icons-material/Place";
import LatLng from "../../nonview/base/LatLng";

export default function CustomBottomNavigator() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState("map");

  useEffect(() => {
    if (location.pathname.startsWith("/map/")) {
      setValue("map");
    } else if (location.pathname.startsWith("/route/")) {
      setValue("routes");
    } else if (location.pathname.startsWith("/bus_halt/")) {
      setValue("halts");
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);

    switch (newValue) {
      case "map":
        // Navigate to map with default location
        const defaultLatLng = LatLng.fromDefault();
        navigate(`/map/${defaultLatLng.toString()}`);
        break;
      case "routes":
        // Navigate to first route
        navigate("/route/138-South-Bound");
        break;
      case "halts":
        // Navigate to first bus halt
        navigate("/bus_halt/Pettah%20(Central%20Bus%20Stand)");
        break;
      default:
        break;
    }
  };

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1100 }}
      elevation={3}
    >
      <BottomNavigation value={value} onChange={handleChange}>
        <BottomNavigationAction label="Map" icon={<MapIcon />} value="map" />
        <BottomNavigationAction
          label="Routes"
          icon={<DirectionsBusIcon />}
          value="routes"
        />
        <BottomNavigationAction
          label="Halts"
          icon={<PlaceIcon />}
          value="halts"
        />
      </BottomNavigation>
    </Paper>
  );
}
