import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";

export default function RouteRedirect() {
  const navigate = useNavigate();
  const { routes, loading } = useData();

  useEffect(() => {
    if (!loading && routes.length > 0) {
      // Navigate to the first route
      navigate(`/route/${encodeURIComponent(routes[0].routeNum)}`, {
        replace: true,
      });
    }
  }, [loading, routes, navigate]);

  return null; // Don't render anything while redirecting
}
