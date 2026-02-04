import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";
import Halt from "../core/Halt";
import Route from "../core/Route";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [halts, setHalts] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHalt, setSelectedHalt] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
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

  useEffect(() => {
    async function loadSelectedHalt() {
      const match = matchPath("/halt/:id", location.pathname);
      if (match?.params?.id) {
        const halt = await Halt.fromID(match.params.id);
        setSelectedHalt(halt);
      } else {
        setSelectedHalt(null);
      }
    }
    loadSelectedHalt();
  }, [location.pathname]);

  useEffect(() => {
    async function loadSelectedRoute() {
      const match = matchPath("/route/:id", location.pathname);
      if (match?.params?.id) {
        const route = await Route.fromID(match.params.id);
        setSelectedRoute(route);
      } else {
        setSelectedRoute(null);
      }
    }
    loadSelectedRoute();
  }, [location.pathname]);

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
