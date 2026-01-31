import { createContext, useContext, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [busHalts, setBusHalts] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();

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

  // Determine selected bus halt from route params
  const selectedBusHalt = params.name
    ? busHalts.find((halt) => halt.name === decodeURIComponent(params.name))
    : null;

  // Determine selected route from route params
  const selectedRoute = params.routeNum
    ? routes.find(
        (route) => route.route_num === decodeURIComponent(params.routeNum),
      )
    : null;

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
