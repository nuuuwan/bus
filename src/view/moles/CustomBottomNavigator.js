import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import RouteIcon from "@mui/icons-material/Route";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import PersonIcon from "@mui/icons-material/Person";

export default function CustomBottomNavigator() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (
      location.pathname.includes("/routes") ||
      location.pathname.includes("/route/")
    ) {
      setValue("routes");
    } else if (
      location.pathname.includes("/halts") ||
      location.pathname.includes("/halt/")
    ) {
      setValue("halts");
    } else if (location.pathname.includes("/buses")) {
      setValue("buses");
    } else if (
      location.pathname.includes("/rides") ||
      location.pathname.match(/\/ride$/)
    ) {
      setValue("rides");
    } else if (location.pathname.includes("/profile")) {
      setValue("profile");
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    const match = location.pathname.match(/^\/([^/]+)/);
    const latLng = match ? match[1] : "";
    const pathParts = location.pathname.split("/").filter(Boolean);
    const isDrawerOpen = pathParts.length > 1;

    // Tapping the active list tab while the drawer is open closes it
    const isOnListPage =
      location.pathname.endsWith("/routes") ||
      location.pathname.endsWith("/halts") ||
      location.pathname.endsWith("/buses") ||
      location.pathname.endsWith("/rides") ||
      location.pathname.endsWith("/profile");
    if (newValue === value && isOnListPage && isDrawerOpen) {
      navigate(`/${latLng}`);
      return;
    }

    setValue(newValue);

    switch (newValue) {
      case "routes":
        navigate(`/${latLng}/routes`);
        break;
      case "halts":
        navigate(`/${latLng}/halts`);
        break;
      case "buses":
        navigate(`/${latLng}/buses`);
        break;
      case "rides":
        navigate(`/${latLng}/rides`);
        break;
      case "profile":
        navigate(`/${latLng}/profile`);
        break;
      default:
        break;
    }
  };

  return (
    <Paper
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels={false}
        sx={{ backgroundColor: "#e8e8e8" }}
      >
        <BottomNavigationAction icon={<StopCircleIcon />} value="halts" />
        <BottomNavigationAction icon={<RouteIcon />} value="routes" />
        <BottomNavigationAction icon={<AirportShuttleIcon />} value="buses" />
        <BottomNavigationAction
          icon={<AirlineSeatReclineExtraIcon />}
          value="rides"
        />
        <BottomNavigationAction icon={<PersonIcon />} value="profile" />
      </BottomNavigation>
    </Paper>
  );
}
