import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useLocation, matchPath } from "react-router-dom";

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
        const [busHaltsResponse, routesResponse] = await Promise.all([
          fetch("/bus/static_data/bus_halts.json"),
          fetch("/bus/static_data/routes.json"),
        ]);

        if (!busHaltsResponse.ok || !routesResponse.ok) {
          throw new Error("Failed to load data");
        }

        const [busHaltsData, routesData] = await Promise.all([
          busHaltsResponse.json(),
          routesResponse.json(),
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
      return routes.find(
        (route) =>
          route.route_num === decodeURIComponent(match.params.routeNum),
      );
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
