import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import StopCircleIcon from "@mui/icons-material/StopCircle";

export default function CustomBottomNavigator() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState("routes");

  useEffect(() => {
    if (
      location.pathname.includes("/routes") ||
      location.pathname.includes("/route/") ||
      location.pathname.match(/^\/[^/]+$/)
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
        <BottomNavigationAction
          label="Routes"
          icon={<DirectionsBusIcon />}
          value="routes"
        />
        <BottomNavigationAction
          label="Halts"
          icon={<StopCircleIcon />}
          value="halts"
        />
      </BottomNavigation>
    </Paper>
  );
}
