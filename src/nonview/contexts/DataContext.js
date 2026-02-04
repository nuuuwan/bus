import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useLocation, matchPath } from "react-router-dom";
import Halt from "../core/Halt";
import Route from "../core/Route";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [halts, setHalts] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [halts, routes] = await Promise.all([
          Halt.listAll(),
          Route.listAll(),
        ]);
        setHalts(halts);
        setRoutes(routes);
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
  const selectedHalt = useMemo(() => {
    const match = matchPath("/halt/:name", location.pathname);
    if (match?.params?.name) {
      return halts.find(
        (halt) => halt.name === decodeURIComponent(match.params.name),
      );
    }
    return null;
  }, [location.pathname, halts]);

  const selectedRoute = useMemo(() => {
    const match = matchPath("/route/:routeNum", location.pathname);
    if (match?.params?.routeNum) {
      const route = routes.find(
        (r) => r.route_num === decodeURIComponent(match.params.routeNum),
      );
      if (route) {
        // Ensure haltNameList is present and fallback to [] if missing
        return {
          ...route,
          halts: route.haltNameList || [],
        };
      }
    }
    return null;
  }, [location.pathname, routes]);

  const value = {
    halts,
    routes,
    selectedHalt,
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
