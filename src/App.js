import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Box,
  Drawer,
  Toolbar,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { DataProvider, useData } from "./nonview/contexts/DataContext";
import CustomBottomNavigator from "./view/moles/CustomBottomNavigator";
import MapView from "./view/moles/MapView";
import Clock from "./view/atoms/Clock";
import RootRedirect from "./view/pages/RootRedirect";
import RouteRedirect from "./view/pages/RouteRedirect";
import HaltRedirect from "./view/pages/HaltRedirect";
import RoutePage from "./view/pages/RoutePage";
import HaltPage from "./view/pages/HaltPage";
import RoutesPage from "./view/pages/RoutesPage";
import HaltsPage from "./view/pages/HaltsPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ccc",
    },
    secondary: {
      main: "#aaa",
    },
  },
  typography: {
    fontFamily: ["Ubuntu Mono", "monospace"].join(","),
  },
});

function DrawerHeader({ onClose }) {
  const location = useLocation();
  const { selectedHalt, selectedRoute } = useData();

  let icon, text, color;

  if (location.pathname.includes("/routes")) {
    icon = <DirectionsBusIcon />;
    text = "Routes";
  } else if (location.pathname.includes("/halts")) {
    icon = <StopCircleIcon />;
    text = "Halts";
  } else if (location.pathname.includes("/route/")) {
    color = selectedRoute ? selectedRoute.getColor() : undefined;
    icon = <DirectionsBusIcon sx={color ? { color } : undefined} />;
    text = selectedRoute ? selectedRoute.displayName : "";
  } else if (location.pathname.includes("/halt/")) {
    icon = <StopCircleIcon />;
    text = selectedHalt ? selectedHalt.displayName : "";
  } else {
    return null;
  }

  return (
    <>
      <Toolbar sx={{ gap: 1 }}>
        {icon}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, ...(color ? { color } : {}) }}
        >
          {text}
        </Typography>
        <IconButton edge="end" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <Divider />
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = location.pathname.split("/").filter(Boolean);
  const isDrawerOpen = pathParts.length > 1;

  const handleDrawerClose = () => {
    const match = location.pathname.match(/^\/([^/]+)/);
    const latLng = match ? match[1] : "";
    navigate(`/${latLng}`);
  };

  return (
    <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Redirect-only routes — render null, just navigate */}
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/:latLngId/route" element={<RouteRedirect />} />
        <Route path="/:latLng/halt" element={<HaltRedirect />} />
      </Routes>

      <MapView />
      <Clock />

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: "min(100vw, 400px)",
          },
        }}
      >
        <DrawerHeader onClose={handleDrawerClose} />
        <Routes>
          <Route path="/:latLngId/routes" element={<RoutesPage />} />
          <Route path="/:latLngId/route/:routeId" element={<RoutePage />} />
          <Route path="/:latLngId/halts" element={<HaltsPage />} />
          <Route path="/:latLngId/halt/:haltId" element={<HaltPage />} />
        </Routes>
      </Drawer>

      <CustomBottomNavigator />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="/bus">
        <DataProvider>
          <AppContent />
        </DataProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
