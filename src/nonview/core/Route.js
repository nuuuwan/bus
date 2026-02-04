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
    return `${this.routeNum} ${this.direction}`;
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
    return (
      {
        10: "orange",
        13: "red",
        14: "blue",
        15: "brown",
        17: "green",
      }[this.routeNum.substring(0, 2)] || "gray"
    );
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
