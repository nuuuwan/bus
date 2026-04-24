import WWW from "../base/WWW";
import LatLng from "../base/LatLng";
import Halt from "./Halt";

export default class Route {
  constructor(routeNum, direction, haltList, latLngList) {
    this.routeNum = routeNum;
    this.direction = direction;
    this.haltList = haltList;
    this.latLngList = latLngList;
  }

  get displayName() {
    return this.shortLabel;
  }

  get shortLabel() {
    const dirMap = {
      northbound: "N",
      southbound: "S",
      eastbound: "E",
      westbound: "W",
      inbound: "I",
      outbound: "O",
      up: "U",
      down: "D",
      circular: "C",
    };
    const abbr =
      dirMap[this.direction?.toLowerCase()] ??
      this.direction?.charAt(0).toUpperCase() ??
      "";
    return `${this.routeNum}${abbr}`;
  }

  static getId(routeNum, direction) {
    return `${routeNum}-${direction}`;
  }

  hasHalt(halt) {
    return this.haltList.map((h) => h.id).includes(halt.id);
  }

  get id() {
    return Route.getId(this.routeNum, this.direction);
  }

  getColor() {
    const COLORS = [
      "#e53935", // red
      "#d81b60", // pink
      "#8e24aa", // purple
      "#5e35b1", // deep purple
      "#1e88e5", // blue
      "#039be5", // light blue
      "#00897b", // teal
      "#43a047", // green
      "#f4511e", // deep orange
      "#fb8c00", // orange
      "#fdd835", // yellow
      "#6d4c41", // brown
      "#00acc1", // cyan
      "#7cb342", // light green
      "#c0ca33", // lime
    ];
    // Hash routeNum to a stable index
    let h = 0;
    for (let i = 0; i < this.routeNum.length; i++) {
      h = (h * 31 + this.routeNum.charCodeAt(i)) >>> 0;
    }
    return COLORS[h % COLORS.length];
  }
  static async listAll() {
    const halts = await Halt.listAll();
    const urlSummaryList =
      "https://raw.githubusercontent.com/nuuuwan" +
      "/bus_py/refs/heads/main/data/routes.json";
    const dList = await WWW.fetchJSON(urlSummaryList);

    const routes = dList.map((d) => {
      const haltList = d.halt_id_list
        .map((haltId) => halts.find((halt) => halt.id === haltId))
        .filter((halt) => halt !== undefined);
      const latLngTuples = d.latlng_list || d.latlng_list_length; // HACK!
      const latLngList = latLngTuples.map((tuple) => LatLng.fromTuple(tuple));
      return new Route(d.route_num, d.direction, haltList, latLngList);
    });

    return routes.sort((a, b) => a.id.localeCompare(b.id));
  }

  static async fromID(id) {
    const routes = await Route.listAll();
    return routes.find((route) => route.id === id);
  }
}
