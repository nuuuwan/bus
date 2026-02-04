import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { DataProvider } from "./nonview/contexts/DataContext";
import CustomAppBar from "./view/moles/CustomAppBar";
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="/bus">
        <DataProvider>
          <Box
            sx={{
              position: "relative",
              height: "100vh",
              maxWidth: "640px",
              margin: "auto",
            }}
          >
            <CustomAppBar />
            {/* Top half - Content area */}
            <Box
              sx={{
                position: "absolute",
                top: 64,
                left: 0,
                right: 0,
                height: "calc(50vh - 64px)",
                overflow: "auto",
                pb: 7,
              }}
            >
              <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/:latLngId" element={<RoutesPage />} />
                <Route path="/:latLngId/routes" element={<RoutesPage />} />
                <Route path="/:latLngId/route" element={<RouteRedirect />} />
                <Route
                  path="/:latLngId/route/:routeId"
                  element={<RoutePage />}
                />
                <Route path="/:latLngId/halts" element={<HaltsPage />} />
                <Route path="/:latLng/halt" element={<HaltRedirect />} />
                <Route path="/:latLngId/halt/:haltId" element={<HaltPage />} />
              </Routes>
            </Box>
            {/* Bottom half - Map always visible, starts exactly at 50vh */}
            <Box
              sx={{
                position: "absolute",
                top: "50vh",
                left: 0,
                right: 0,
                height: "50vh",
              }}
            >
              <MapView />
            </Box>
            <CustomBottomNavigator />
          </Box>
        </DataProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
