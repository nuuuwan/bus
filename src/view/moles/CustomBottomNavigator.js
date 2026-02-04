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
    // Extract latLng from pathname - it's the first segment after basename
    const match = location.pathname.match(/^\/([^/]+)/);
    const latLng = match ? match[1] : "";

    if (location.pathname === `/${latLng}`) {
      setValue("map");
    } else if (
      location.pathname.includes("/routes") ||
      location.pathname.includes("/route/")
    ) {
      setValue("routes");
    } else if (
      location.pathname.includes("/halts") ||
      location.pathname.includes("/halt/")
    ) {
      setValue("halts");
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);

    // Extract latLng from current pathname
    const match = location.pathname.match(/^\/([^/]+)/);
    const latLng = match ? match[1] : "";

    switch (newValue) {
      case "map":
        // Navigate to map at current location
        navigate(`/${latLng}`);
        break;
      case "routes":
        // Navigate to routes list page
        navigate(`/${latLng}/routes`);
        break;
      case "halts":
        // Navigate to halts list page
        navigate(`/${latLng}/halts`);
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
