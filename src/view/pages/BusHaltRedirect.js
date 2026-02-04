import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";

export default function BusHaltRedirect() {
  const navigate = useNavigate();
  const { halts, loading } = useData();

  useEffect(() => {
    if (!loading && halts.length > 0) {
      // Navigate to the first halt
      navigate(`/halt/${encodeURIComponent(halts[0].id)}`, {
        replace: true,
      });
    }
  }, [loading, halts, navigate]);

  return null; // Don't render anything while redirecting
}
