import NumberPlate from "./NumberPlate";
import { useClock } from "../../nonview/contexts/ClockContext";

export default function BusInfo({ bus }) {
  const now = useClock();
  const atHalt = !!bus.currentHalt(now);
  return <NumberPlate bus={bus} atHalt={atHalt} />;
}
