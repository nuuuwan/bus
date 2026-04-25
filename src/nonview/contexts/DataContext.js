import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";
import Halt from "../core/Halt";
import Route from "../core/Route";
import Bus from "../core/Bus";
import User from "../core/User";
import Ride from "../core/Ride";
import LatLng from "../base/LatLng";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [halts, setHalts] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHalt, setSelectedHalt] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [currentLatLng, setCurrentLatLng] = useState(null);
  const [user, setUser] = useState(() => User.getDefault());
  const [ride, setRide] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);
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
        setBuses(Bus.fromRoutes(routes));
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
      const match = matchPath("/:latLngId/halt/:haltId", location.pathname);
      if (match?.params?.haltId) {
        const halt = await Halt.fromID(match.params.haltId);
        setSelectedHalt(halt);
      } else {
        setSelectedHalt(null);
      }
    }
    loadSelectedHalt();
  }, [location.pathname]);

  useEffect(() => {
    const match = matchPath("/:latLngId/bus/:busId", location.pathname);
    if (match?.params?.busId) {
      const busId = decodeURIComponent(match.params.busId);
      const found = buses.find((b) => b.id === busId) ?? null;
      setSelectedBus(found);
    } else {
      setSelectedBus(null);
    }
  }, [location.pathname, buses]);

  useEffect(() => {
    async function loadSelectedRoute() {
      const match = matchPath("/:latLngId/route/:routeId", location.pathname);
      if (match?.params?.routeId) {
        const route = await Route.fromID(match.params.routeId);
        setSelectedRoute(route);
      } else {
        setSelectedRoute(null);
      }
    }
    loadSelectedRoute();
  }, [location.pathname]);

  useEffect(() => {
    // Extract latLngId from any route pattern
    const patterns = [
      "/:latLngId",
      "/:latLngId/routes",
      "/:latLngId/route",
      "/:latLngId/route/:routeId",
      "/:latLngId/halts",
      "/:latLngId/halt",
      "/:latLngId/halt/:haltId",
      "/:latLngId/buses",
      "/:latLngId/bus/:busId",
      "/:latLngId/rides",
    ];

    let latLngId = null;
    for (const pattern of patterns) {
      const match = matchPath(pattern, location.pathname);
      if (match?.params?.latLngId) {
        latLngId = match.params.latLngId;
        break;
      }
    }

    if (latLngId) {
      try {
        const latLng = LatLng.fromString(latLngId);
        setCurrentLatLng(latLng);
      } catch (err) {
        console.error("Error parsing latLngId:", err);
        setCurrentLatLng(null);
      }
    } else {
      setCurrentLatLng(null);
    }
  }, [location.pathname]);

  function boardBus(bus, halt) {
    if (ride) return; // already riding
    if (user.cashBalance < Ride.FARE_LKR) return; // insufficient funds
    setRide(new Ride(bus, halt, Date.now()));
    setUser(
      new User(user.name, user.address, user.cashBalance - Ride.FARE_LKR),
    );
  }

  function alightBus(halt) {
    if (ride) {
      setRideHistory((prev) => [...prev, ride.withAlight(halt ?? null, Date.now())]);
    }
    setRide(null);
  }

  const value = {
    halts,
    routes,
    buses,
    selectedHalt,
    selectedRoute,
    selectedBus,
    currentLatLng,
    user,
    ride,
    rideHistory,
    boardBus,
    alightBus,
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
