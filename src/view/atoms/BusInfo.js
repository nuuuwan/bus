import { Box } from "@mui/material";
import NumberPlate from "./NumberPlate";
import RouteIconView from "./RouteIcon";

export default function BusInfo({ bus }) {
  return (
    <Box display="flex" alignItems="center" gap={0.5} flexWrap="wrap">
      <NumberPlate bus={bus} />
      <RouteIconView route={bus.route} />
    </Box>
  );
}
