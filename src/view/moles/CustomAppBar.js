import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function CustomAppBar() {
  const location = useLocation();
  const params = useParams();

  const getTitle = () => {
    if (location.pathname.startsWith("/route/")) {
      return `Route: ${params.routeNum || ""}`;
    } else if (location.pathname.startsWith("/halt/")) {
      return `Halt: ${decodeURIComponent(params.name || "")}`;
    } else if (location.pathname.startsWith("/map/")) {
      return "Map";
    }
    return "Bus";
  };

  const title = getTitle();

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
