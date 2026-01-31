import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { DataProvider } from "./nonview/contexts/DataContext";
import CustomAppBar from "./view/moles/CustomAppBar";
import CustomBottomNavigator from "./view/moles/CustomBottomNavigator";
import RootRedirect from "./view/pages/RootRedirect";
import MapPage from "./view/pages/MapPage";
import RoutePage from "./view/pages/RoutePage";
import BusHaltPage from "./view/pages/BusHaltPage";

const theme = createTheme({
  typography: {
    fontFamily: ["Ubuntu Mono", "monospace"].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DataProvider>
        <BrowserRouter basename="/bus">
          <Box sx={{ pb: 7 }}>
            <CustomAppBar />
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/map/:latLng" element={<MapPage />} />
              <Route path="/route/:routeNum" element={<RoutePage />} />
              <Route path="/bus_halt/:name" element={<BusHaltPage />} />
            </Routes>
            <CustomBottomNavigator />
          </Box>
        </BrowserRouter>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
