import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import MapIcon from "@mui/icons-material/Map";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PlaceIcon from "@mui/icons-material/Place";

export default function CustomBottomNavigator() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState("map");

  useEffect(() => {
    if (location.pathname.startsWith("/map/")) {
      setValue("map");
    } else if (location.pathname.startsWith("/route/")) {
      setValue("routes");
    } else if (location.pathname.startsWith("/halt/")) {
      setValue("halts");
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);

    switch (newValue) {
      case "map":
        // Navigate to map route (will auto-redirect to geolocation or default)
        navigate("/map");
        break;
      case "routes":
        // Navigate to route (will auto-redirect to first route)
        navigate("/route");
        break;
      case "halts":
        // Navigate to halt (will auto-redirect to first halt)
        navigate("/halt");
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
