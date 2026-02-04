import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PlaceIcon from "@mui/icons-material/Place";
import MapIcon from "@mui/icons-material/Map";
import { useData } from "../../nonview/contexts/DataContext";

export default function CustomAppBar() {
  const location = useLocation();
  const params = useParams();
  const { selectedHalt, selectedRoute } = useData();

  const getTitle = () => {
    if (location.pathname.startsWith("/route/")) {
      const color = selectedRoute ? selectedRoute.getColor() : undefined;
      return {
        icon: <DirectionsBusIcon sx={{ color }} />,
        text: selectedRoute ? selectedRoute.displayName : params.id || "",
        color,
      };
    } else if (location.pathname.startsWith("/halt/")) {
      return {
        icon: <PlaceIcon />,
        text: selectedHalt
          ? selectedHalt.displayName
          : decodeURIComponent(params.id || ""),
      };
    } else if (location.pathname.startsWith("/map/")) {
      const latLngMatch = location.pathname.match(/^\/map\/(.+)$/);
      const latLng = latLngMatch ? decodeURIComponent(latLngMatch[1]) : null;
      return {
        icon: <MapIcon />,
        text: latLng || "Map",
      };
    }
    return {
      icon: <DirectionsBusIcon />,
      text: "Bus",
    };
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
