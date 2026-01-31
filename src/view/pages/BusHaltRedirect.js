import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";

export default function BusHaltRedirect() {
  const navigate = useNavigate();
  const { busHalts, loading } = useData();

  useEffect(() => {
    if (!loading && busHalts.length > 0) {
      // Navigate to the first bus halt
      navigate(`/bus_halt/${encodeURIComponent(busHalts[0].name)}`, {
        replace: true,
      });
    }
  }, [loading, busHalts, navigate]);

  return null; // Don't render anything while redirecting
}
