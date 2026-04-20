import LatLng from "../base/LatLng";

/**
 * A simulated bus travelling along a Route.
 *
 * Position is derived deterministically from:
 *   - the route's halt list / latLng list (the path)
 *   - a per-bus seeded "phase offset" so multiple buses on the same route are
 *     spread apart
 *   - the current wall-clock time (minutes of day), so the bus moves
 *     continuously between re-renders triggered by a timer
 *
 * No real-time data is used — this is entirely synthetic.
 */
export default class Bus {
  /**
   * @param {Route} route  — the Route this bus travels
   * @param {number} busIndex — which simulated bus on this route (0-based)
   * @param {number} totalBusesOnRoute — total number of simulated buses on the route
   */
  constructor(route, busIndex, totalBusesOnRoute) {
    this.route = route;
    this.busIndex = busIndex;
    this.totalBusesOnRoute = totalBusesOnRoute;
  }

  get id() {
    return `${this.route.id}-bus-${this.busIndex}`;
  }

  /**
   * The path the bus follows: prefer the dense latLngList polyline if present,
   * otherwise fall back to the halt positions.
   */
  get _path() {
    if (this.route.latLngList && this.route.latLngList.length > 1) {
      return this.route.latLngList;
    }
    return this.route.haltList.filter((h) => h.latLng).map((h) => h.latLng);
  }

  /**
   * Total arc-length of the path (sum of segment distances, in metres).
   */
  get _totalLength() {
    const path = this._path;
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
      total += path[i].distanceTo(path[i + 1]);
    }
    return total;
  }

  /**
   * Current progress along the path [0, 1).
   *
   * One full traversal takes CYCLE_MINUTES minutes.  Each bus is offset by
   * (busIndex / totalBusesOnRoute) so they are evenly spread.
   */
  static CYCLE_MINUTES = 60; // one full route traversal in this many minutes

  _progressAt(nowMs) {
    const minutesOfDay = (nowMs / 60_000) % (24 * 60);
    const cycleProgress =
      (minutesOfDay % Bus.CYCLE_MINUTES) / Bus.CYCLE_MINUTES;
    const offset = this.busIndex / this.totalBusesOnRoute;
    return (cycleProgress + offset) % 1;
  }

  /**
   * Interpolate a LatLng on the path at the given progress fraction [0, 1).
   */
  _latLngAtProgress(progress) {
    const path = this._path;
    if (path.length === 0) return null;
    if (path.length === 1) return path[0];

    const target = progress * this._totalLength;
    let accumulated = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const segLen = path[i].distanceTo(path[i + 1]);
      if (accumulated + segLen >= target) {
        const t = segLen > 0 ? (target - accumulated) / segLen : 0;
        const lat = path[i].lat + t * (path[i + 1].lat - path[i].lat);
        const lng = path[i].lng + t * (path[i + 1].lng - path[i].lng);
        return new LatLng(lat, lng);
      }
      accumulated += segLen;
    }

    // Reached the end — return last point
    return path[path.length - 1];
  }

  /**
   * LatLng of this bus at the given timestamp (ms since epoch).
   * Pass Date.now() for the current position.
   */
  latLngAt(nowMs = Date.now()) {
    const path = this._path;
    if (path.length < 2) return null;
    return this._latLngAtProgress(this._progressAt(nowMs));
  }

  // ── Factory ──────────────────────────────────────────────────────────────

  /** Number of simulated buses spawned per route. */
  static BUSES_PER_ROUTE = 3;

  /**
   * Generate all simulated buses for an array of routes.
   * @param {Route[]} routes
   * @returns {Bus[]}
   */
  static fromRoutes(routes) {
    const buses = [];
    for (const route of routes) {
      const path =
        route.latLngList?.length > 1
          ? route.latLngList
          : route.haltList.filter((h) => h.latLng).map((h) => h.latLng);
      if (path.length < 2) continue;

      for (let i = 0; i < Bus.BUSES_PER_ROUTE; i++) {
        buses.push(new Bus(route, i, Bus.BUSES_PER_ROUTE));
      }
    }
    return buses;
  }
}
