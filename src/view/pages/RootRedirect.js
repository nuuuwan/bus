import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LatLng from "../../nonview/base/LatLng";

export default function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    async function redirect() {
      try {
        const latLng = await LatLng.fromGeolocation();
        navigate(`/${latLng.toString()}/routes`, { replace: true });
      } catch (error) {
        const defaultLatLng = LatLng.fromDefault();
        navigate(`/${defaultLatLng.toString()}/routes`, { replace: true });
      }
    }

    redirect();
  }, [navigate]);

  return null;
}
