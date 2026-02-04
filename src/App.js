import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { DataProvider } from "./nonview/contexts/DataContext";
import CustomAppBar from "./view/moles/CustomAppBar";
import CustomBottomNavigator from "./view/moles/CustomBottomNavigator";
import RootRedirect from "./view/pages/RootRedirect";
import RouteRedirect from "./view/pages/RouteRedirect";
import HaltRedirect from "./view/pages/HaltRedirect";
import MapPage from "./view/pages/MapPage";
import RoutePage from "./view/pages/RoutePage";
import HaltPage from "./view/pages/HaltPage";

const theme = createTheme({
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
          <Box sx={{ pb: 7 }}>
            <CustomAppBar />
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/map" element={<RootRedirect />} />
              <Route path="/map/:latLng" element={<MapPage />} />
              <Route path="/route" element={<RouteRedirect />} />
              <Route path="/route/:id" element={<RoutePage />} />
              <Route path="/halt" element={<HaltRedirect />} />
              <Route path="/halt/:id" element={<HaltPage />} />
            </Routes>
            <CustomBottomNavigator />
          </Box>
        </DataProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
