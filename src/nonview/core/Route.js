import WWW from "../base/WWW";
import LatLng from "../base/LatLng";
export default class Route {
  constructor(routeNum, direction, haltNameList, latLngList) {
    this.routeNum = routeNum;
    this.direction = direction;
    this.haltNameList = haltNameList;
    this.latLngList = latLngList;
  }
  static fromPythonDict(d) {
    return new Route(
      d.route_num,
      d.direction,
      d.halt_name_list,
      d.latlng_list
        ? d.latlng_list.map((latlng) => LatLng.fromTuple(latlng))
        : [],
    );
  }

  static async listAll() {
    const urlSummaryList =
      "https://raw.githubusercontent.com/nuuuwan" +
      "/bus_py/refs/heads/main/data/routes.summary.json";
    const routeSummaryDList = await WWW.fetchJSON(urlSummaryList);

    const routePromises = routeSummaryDList.map(async (dSummary) => {
      const urlDetails =
        `https://raw.githubusercontent.com` +
        `/nuuuwan/bus_py/refs/heads/main/data/routes` +
        `/${dSummary.route_num}-${dSummary.direction}.json`;
      const d = await WWW.fetchJSON(urlDetails);
      return Route.fromPythonDict(d);
    });
    return Promise.all(routePromises);
  }
}
