import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";

export default function HaltRedirect() {
  const navigate = useNavigate();
  const params = useParams();
  const { halts, loading } = useData();

  useEffect(() => {
    if (!loading && halts.length > 0) {
      // Navigate to the first halt
      const latLng = params.latLngId || "";
      navigate(`/${latLng}/halt/${encodeURIComponent(halts[0].id)}`, {
        replace: true,
      });
    }
  }, [loading, halts, navigate, params.latLngId]);

  return null; // Don't render anything while redirecting
}
