import { createContext, useContext, useState, useEffect } from "react";

const ClockContext = createContext(Date.now());

export function ClockProvider({ children }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return <ClockContext.Provider value={now}>{children}</ClockContext.Provider>;
}

export function useClock() {
  return useContext(ClockContext);
}
