import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../nonview/contexts/DataContext";

export default function RouteRedirect() {
  const navigate = useNavigate();
  const params = useParams();
  const { routes, loading } = useData();

  useEffect(() => {
    if (!loading && routes.length > 0) {
      // Navigate to the first route
      const latLng = params.latLng || "";
      navigate(`/${latLng}/route/${encodeURIComponent(routes[0].id)}`, {
        replace: true,
      });
    }
  }, [loading, routes, navigate, params.latLng]);

  return null; // Don't render anything while redirecting
}
