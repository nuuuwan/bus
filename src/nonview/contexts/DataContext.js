import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useLocation, matchPath } from "react-router-dom";
import Halt from "../core/Halt";
import Route from "../core/Route";
import Bus from "../core/Bus";
import User from "../core/User";
import Ride from "../core/Ride";
import LatLng from "../base/LatLng";

const STORAGE_USER = "bus_app_user";
const STORAGE_RIDE = "bus_app_ride";
const STORAGE_RIDE_HISTORY = "bus_app_ride_history";

function serializeRide(ride) {
  if (!ride) return null;
  return {
    busId: ride.bus.id,
    boardedAtHaltId: ride.boardedAtHalt?.id ?? null,
    boardedAtMs: ride.boardedAtMs,
    alightedAtHaltId: ride.alightedAtHalt?.id ?? null,
    alightedAtMs: ride.alightedAtMs,
  };
}

function deserializeRide(data, buses, halts) {
  if (!data) return null;
  const bus = buses.find((b) => b.id === data.busId);
  const boardedAtHalt = halts.find((h) => h.id === data.boardedAtHaltId);
  if (!bus || !boardedAtHalt) return null;
  const alightedAtHalt = data.alightedAtHaltId
    ? (halts.find((h) => h.id === data.alightedAtHaltId) ?? null)
    : null;
  return new Ride(
    bus,
    boardedAtHalt,
    data.boardedAtMs,
    alightedAtHalt,
    data.alightedAtMs,
  );
}

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
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER);
      if (raw) {
        const d = JSON.parse(raw);
        return new User(d.name, d.address, d.cashBalance);
      }
    } catch {}
    return User.getDefault();
  });
  const [ride, setRide] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);
  const restoredRef = useRef(false);
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
      "/:latLngId/ride",
      "/:latLngId/rides",
      "/:latLngId/profile",
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
        // While riding, the setInterval below tracks the bus position;
        // don't let the (stale) URL override it.
        setCurrentLatLng((prev) => (ride ? prev : latLng));
      } catch (err) {
        console.error("Error parsing latLngId:", err);
        setCurrentLatLng(null);
      }
    } else {
      setCurrentLatLng(null);
    }
  }, [location.pathname, ride]);

  // While riding, keep currentLatLng in sync with the bus position so that
  // proximity sorting, the dotted line, and other location-dependent UI
  // reflect where the user actually is.
  useEffect(() => {
    if (!ride) return;
    const timer = setInterval(() => {
      const pos = ride.bus.latLngAt(Date.now());
      if (pos) {
        setCurrentLatLng(new LatLng(pos.lat, pos.lng));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [ride]);

  // Restore ride state from localStorage once buses & halts are available
  useEffect(() => {
    if (loading || buses.length === 0 || halts.length === 0) return;
    if (restoredRef.current) return;
    restoredRef.current = true;
    try {
      const rawRide = localStorage.getItem(STORAGE_RIDE);
      if (rawRide) {
        const restored = deserializeRide(JSON.parse(rawRide), buses, halts);
        if (restored) setRide(restored);
      }
      const rawHistory = localStorage.getItem(STORAGE_RIDE_HISTORY);
      if (rawHistory) {
        const restoredHistory = JSON.parse(rawHistory)
          .map((d) => deserializeRide(d, buses, halts))
          .filter(Boolean);
        if (restoredHistory.length > 0) setRideHistory(restoredHistory);
      }
    } catch (err) {
      console.error("Failed to restore rides from localStorage:", err);
    }
  }, [loading, buses, halts]);

  // Persist user on change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_USER,
        JSON.stringify({
          name: user.name,
          address: user.address,
          cashBalance: user.cashBalance,
        }),
      );
    } catch {}
  }, [user]);

  // Persist active ride on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RIDE, JSON.stringify(serializeRide(ride)));
    } catch {}
  }, [ride]);

  // Persist ride history on change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_RIDE_HISTORY,
        JSON.stringify(rideHistory.map(serializeRide)),
      );
    } catch {}
  }, [rideHistory]);

  function boardBus(bus, halt) {
    if (ride) return; // already riding
    if (user.cashBalance < Ride.FARE_BASE_LKR) return; // insufficient funds
    setRide(new Ride(bus, halt, Date.now()));
    // Fare is deducted at alight time once the actual amount is known
  }

  function alightBus(halt) {
    if (ride) {
      const ms = Date.now();
      const finalFare = ride.fareAt(ms);
      setRideHistory((prev) => [...prev, ride.withAlight(halt ?? null, ms)]);
      setUser(new User(user.name, user.address, user.cashBalance - finalFare));
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
