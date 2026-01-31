import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./nonview/contexts/DataContext";
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
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/map/:latLng" element={<MapPage />} />
            <Route path="/route/:routeNum" element={<RoutePage />} />
            <Route path="/bus_halt/:name" element={<BusHaltPage />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
