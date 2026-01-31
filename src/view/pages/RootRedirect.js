import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LatLng from "../../nonview/base/LatLng";

export default function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    async function redirect() {
      try {
        const latLng = await LatLng.fromGeolocation();
        navigate(`/map/${latLng.toString()}`, { replace: true });
      } catch (error) {
        // Geolocation failed or not supported, use default
        const defaultLatLng = LatLng.fromDefault();
        navigate(`/map/${defaultLatLng.toString()}`, { replace: true });
      }
    }

    redirect();
  }, [navigate]);

  return null; // Don't render anything while redirecting
}
