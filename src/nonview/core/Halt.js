import LatLng from "../base/LatLng";
import WWW from "../base/WWW";

export default class Halt {
  constructor(name, latLng) {
    this.name = name;
    this.latLng = latLng;
  }

  get displayName() {
    return this.name.replace(" Bus Stop", "");
  }

  get nameKebabCase() {
    return this.name.toLowerCase().replace(/\s+/g, "-");
  }

  get id() {
    const lat = this.latLng.lat;
    const lng = this.latLng.lng;
    const latStr = `${Math.abs(lat).toFixed(4)}${lat >= 0 ? "N" : "S"}`;
    const lngStr = `${Math.abs(lng).toFixed(4)}${lng >= 0 ? "E" : "W"}`;
    return `${this.nameKebabCase}-${latStr}-${lngStr}`;
  }

  static fromPythonDict(d) {
    return new Halt(d.name, LatLng.fromTuple(d.latlng));
  }

  static async listAll() {
    const url =
      "https://raw.githubusercontent.com/nuuuwan/bus_py/refs/heads/main/data/halts.json";
    const haltDicts = await WWW.fetchJSON(url);
    const halts = haltDicts.map((obj) => Halt.fromPythonDict(obj));
    return halts.sort((a, b) => a.id.localeCompare(b.id));
  }

  static async fromID(id) {
    const halts = await Halt.listAll();
    return halts.find((halt) => halt.id === id);
  }
}
