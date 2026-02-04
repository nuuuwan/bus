import WWW from "../base/WWW";

export default class Route {
  constructor(routeName, direction, haltNameList, latLngList) {
    this.routeName = routeName;
    this.direction = direction;
    this.haltNameList = haltNameList;
    this.latLngList = latLngList;
  }
  static fromPythonDict(d) {
    return new Route(
      d.route_name,
      d.direction,
      d.halt_name_list,
      d.lat_lng_list || [],
    );
  }

  static async listAll() {
    const url =
      "https://raw.githubusercontent.com/nuuuwan" +
      "/bus_py/refs/heads/main/data/routes.summary.json";
    const routeSummaryDList = await WWW.fetchJSON(url);

    const routePromises = routeSummaryDList.map(async (d) => {
      const latLngUrl =
        `https://raw.githubusercontent.com` +
        `/nuuuwan/bus_py/refs/heads/main/data/routes` +
        `/${d.route_num}-${d.direction}.json`;
      const latLngList = await WWW.fetchJSON(latLngUrl);
      return new Route(d.route_num, d.direction, d.halt_name_list, latLngList);
    });
    return Promise.all(routePromises);
  }
}
