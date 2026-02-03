import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useLocation, matchPath } from "react-router-dom";
import WWW from "../base/WWW";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [busHalts, setBusHalts] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [busHaltsData, routesData] = await Promise.all([
          WWW.fetchJSON(
            "https://raw.githubusercontent.com/nuuuwan/bus_py/refs/heads/main/data/halts.json",
          ),
          WWW.fetchJSON(
            "https://raw.githubusercontent.com/nuuuwan/bus_py/refs/heads/main/data/routes.summary.json",
          ),
        ]);
        setBusHalts(busHaltsData);
        setRoutes(routesData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Extract route params based on current location using matchPath
  const selectedBusHalt = useMemo(() => {
    const match = matchPath("/bus_halt/:name", location.pathname);
    if (match?.params?.name) {
      return busHalts.find(
        (halt) => halt.name === decodeURIComponent(match.params.name),
      );
    }
    return null;
  }, [location.pathname, busHalts]);

  const selectedRoute = useMemo(() => {
    const match = matchPath("/route/:routeNum", location.pathname);
    if (match?.params?.routeNum) {
      const route = routes.find(
        (r) => r.route_num === decodeURIComponent(match.params.routeNum),
      );
      if (route) {
        // Ensure halt_name_list is present and fallback to [] if missing
        return {
          ...route,
          bus_halts: route.halt_name_list || [],
        };
      }
    }
    return null;
  }, [location.pathname, routes]);

  const value = {
    busHalts,
    routes,
    selectedBusHalt,
    selectedRoute,
    loading,
    error,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
