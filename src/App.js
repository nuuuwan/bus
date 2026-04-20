import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Box, Drawer } from "@mui/material";
import { DataProvider } from "./nonview/contexts/DataContext";
import CustomBottomNavigator from "./view/moles/CustomBottomNavigator";
import MapView from "./view/moles/MapView";
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
