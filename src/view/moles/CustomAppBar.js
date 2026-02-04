import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import MapIcon from "@mui/icons-material/Map";
import { useData } from "../../nonview/contexts/DataContext";

export default function CustomAppBar() {
  const location = useLocation();
  const params = useParams();
  const { selectedHalt, selectedRoute } = useData();

  const getTitle = () => {
    // Check for routes list page
    if (location.pathname.includes("/routes")) {
      return {
        icon: <DirectionsBusIcon />,
        text: "Routes",
      };
    }
    // Check for halts list page
    else if (location.pathname.includes("/halts")) {
      return {
        icon: <StopCircleIcon />,
        text: "Halts",
      };
    }
    // Check if we're on a route page (with latLng prefix)
    else if (location.pathname.includes("/route/")) {
      const color = selectedRoute ? selectedRoute.getColor() : undefined;
      return {
        icon: <DirectionsBusIcon sx={{ color }} />,
        text: selectedRoute ? selectedRoute.displayName : params.routeId || "",
        color,
      };
    } else if (location.pathname.includes("/halt/")) {
      return {
        icon: <StopCircleIcon />,
        text: selectedHalt
          ? selectedHalt.displayName
          : decodeURIComponent(params.haltId || ""),
      };
    } else {
      // Map view - extract latLng from path (first segment)
      const latLngMatch = location.pathname.match(/^\/([^/]+)$/);
      const latLng = latLngMatch ? decodeURIComponent(latLngMatch[1]) : null;
      return {
        icon: <MapIcon />,
        text: latLng || "Map",
      };
    }
  };

  const title = getTitle();

  useEffect(() => {
    document.title = title.text;
  }, [title.text]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" alignItems="center" gap={1} sx={{ flexGrow: 1 }}>
          {title.icon}
          <Typography
            variant="h6"
            component="div"
            sx={title.color ? { color: title.color } : undefined}
          >
            {title.text}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
