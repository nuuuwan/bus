import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Box, Drawer, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RouteIcon from "@mui/icons-material/Route";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PersonIcon from "@mui/icons-material/Person";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import { DataProvider, useData } from "./nonview/contexts/DataContext";
import { ClockProvider } from "./nonview/contexts/ClockContext";
import NumberPlate from "./view/atoms/NumberPlate";
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
import BusesPage from "./view/pages/BusesPage";
import BusPage from "./view/pages/BusPage";
import RideView from "./view/pages/RideView";
import RidesPage from "./view/pages/RidesPage";
import UserProfilePage from "./view/pages/UserProfilePage";

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
  const { selectedHalt, selectedRoute, selectedBus } = useData();

  let icon, text, color;

  if (location.pathname.includes("/routes")) {
    icon = <RouteIcon />;
    text = "Routes Near You";
  } else if (location.pathname.includes("/halts")) {
    icon = <StopCircleIcon />;
    text = "Halts Near You";
  } else if (location.pathname.includes("/rides")) {
    icon = <AirlineSeatReclineExtraIcon />;
    text = "Ride History";
  } else if (location.pathname.includes("/profile")) {
    icon = <PersonIcon />;
    text = "My Profile";
  } else if (location.pathname.match(/\/ride$/)) {
    icon = <DirectionsBusIcon sx={{ color: "success.main" }} />;
    text = "On Bus";
  } else if (location.pathname.includes("/route/")) {
    color = selectedRoute ? selectedRoute.getColor() : undefined;
    icon = <RouteIcon sx={color ? { color } : undefined} />;
    text = selectedRoute ? selectedRoute.displayName : "";
  } else if (location.pathname.includes("/halt/")) {
    icon = <StopCircleIcon />;
    text = selectedHalt ? selectedHalt.displayName : "";
  } else if (location.pathname.includes("/buses")) {
    icon = <AirportShuttleIcon />;
    text = "Buses Near You";
  } else if (location.pathname.match(/\/bus\//)) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1.5,
            py: 0.75,
            minHeight: 40,
            gap: 1,
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            {selectedBus && <NumberPlate bus={selectedBus} />}
          </Box>
          <IconButton size="small" onClick={onClose} aria-label="close">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </>
    );
  } else {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: 1.5,
        py: 0.75,
        minHeight: 40,
        gap: 1,
      }}
    >
      {icon}
      <Typography
        variant="subtitle1"
        sx={{ flexGrow: 1, fontWeight: 600, ...(color ? { color } : {}) }}
      >
        {text}
      </Typography>
      <IconButton size="small" onClick={onClose} aria-label="close">
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
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
    <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Redirect-only routes — render null, just navigate */}
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/:latLngId" element={null} />
        <Route path="/:latLngId/route" element={<RouteRedirect />} />
        <Route path="/:latLng/halt" element={<HaltRedirect />} />
      </Routes>

      <MapView />
      <Clock />

      <Drawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        hideBackdrop
        disableScrollLock
        sx={{
          pointerEvents: "none",
          "& .MuiDrawer-paper": {
            height: "50vh",
            borderRadius: "16px 16px 0 0",
            pointerEvents: "auto",
            width: "min(100vw, 390px)",
            left: "max(0px, calc((100% - 390px) / 2))",
            right: "auto",
            bottom: 0,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DrawerHeader onClose={handleDrawerClose} />
        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Routes>
            <Route path="/:latLngId/routes" element={<RoutesPage />} />
            <Route path="/:latLngId/route/:routeId" element={<RoutePage />} />
            <Route path="/:latLngId/halts" element={<HaltsPage />} />
            <Route path="/:latLngId/halt/:haltId" element={<HaltPage />} />
            <Route path="/:latLngId/buses" element={<BusesPage />} />
            <Route path="/:latLngId/bus/:busId" element={<BusPage />} />
            <Route path="/:latLngId/ride" element={<RideView />} />
            <Route path="/:latLngId/rides" element={<RidesPage />} />
            <Route path="/:latLngId/profile" element={<UserProfilePage />} />
          </Routes>
        </Box>
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
          <ClockProvider>
            <AppContent />
          </ClockProvider>
        </DataProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
