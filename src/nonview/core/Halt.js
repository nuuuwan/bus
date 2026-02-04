import LatLng from "../base/LatLng";
import WWW from "../base/WWW";

export default class Halt {
  constructor(name, latLng) {
    this.name = name;
    this.latLng = latLng;
  }
  static fromPythonDict(d) {
    return new Halt(d.name, LatLng.fromTuple(d.latlng));
  }

  static async listAll() {
    const url =
      "https://raw.githubusercontent.com/nuuuwan/bus_py/refs/heads/main/data/halts.json";
    const haltDicts = await WWW.fetchJSON(url);
    return haltDicts.map((obj) => Halt.fromPythonDict(obj));
  }
}
