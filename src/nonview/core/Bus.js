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
   * A deterministic pseudo-random float in [0, 1) derived from a string seed.
   * Uses a simple djb2-style hash so the value is always the same for the
   * same seed — no Math.random() involved.
   */
  static _seededFloat(seed) {
    let h = 2166136261; // FNV-1a 32-bit offset basis
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0; // FNV prime, keep 32-bit unsigned
    }
    return (h >>> 0) / 4294967296; // map to [0, 1)
  }

  /**
   * A deterministic integer in [0, max) derived from a string seed.
   */
  static _seededInt(seed, max) {
    return Math.floor(Bus._seededFloat(seed) * max);
  }

  /**
   * Sri-Lanka-style number plate, deterministically generated from the bus id.
   *
   * Format: <province> <LL>-<NNNN>
   *   province — one of the SL provincial abbreviations
   *   LL       — two uppercase letters
   *   NNNN     — four-digit number (0001–9999)
   *
   * Example: WP · BA-3847
   */
  get numberPlate() {
    const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // no I/O to avoid confusion
    const l1 = letters[Bus._seededInt(`${this.id}:l1`, letters.length)];
    const l2 = letters[Bus._seededInt(`${this.id}:l2`, letters.length)];
    const num = (Bus._seededInt(`${this.id}:num`, 9999) + 1)
      .toString()
      .padStart(4, "0");
    return `${l1}${l2}-${num}`;
  }

  /**
   * Current progress along the path [0, 1).
   *
   * One full traversal takes CYCLE_MINUTES minutes.  Each bus is offset by a
   * seeded pseudo-random value derived from its route id and bus index, so
   * buses are irregularly spread but the positions are identical on every
   * page refresh.
   */
  /**
   * CYCLE_MINUTES is the base travel time for one full route traversal.
   * SPEED_VARIATION controls how much each bus's speed can differ (±fraction).
   */
  static CYCLE_MINUTES = 60;
  static SPEED_VARIATION = 0.25; // ±25%

  /**
   * Per-bus cycle duration (minutes) — gives each bus a slightly different speed.
   */
  _cycleMinutes() {
    const variation = Bus._seededFloat(`${this.id}:speed`);
    // Maps [0, 1) → [CYCLE*(1-VAR), CYCLE*(1+VAR)]
    return (
      Bus.CYCLE_MINUTES *
      (1 - Bus.SPEED_VARIATION + variation * 2 * Bus.SPEED_VARIATION)
    );
  }

  _progressAt(nowMs) {
    const cycleMs = this._cycleMinutes() * 60_000;
    const cycleProgress = (nowMs % cycleMs) / cycleMs;
    // Evenly space buses around the route, then add a small jitter so they
    // don't look mechanical. Jitter is at most 10% of the even spacing.
    const baseOffset = this.busIndex / this.totalBusesOnRoute;
    const jitter =
      Bus._seededFloat(`${this.route.id}:${this.busIndex}:jitter`) *
      (0.1 / Math.max(this.totalBusesOnRoute, 1));
    const offset = (baseOffset + jitter) % 1;
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

  /**
   * Bearing (degrees clockwise from north) of travel at the given timestamp.
   */
  headingAt(nowMs = Date.now()) {
    const path = this._path;
    if (path.length < 2) return 0;
    const progress = this._progressAt(nowMs);
    const target = progress * this._totalLength;
    let accumulated = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const segLen = path[i].distanceTo(path[i + 1]);
      if (accumulated + segLen >= target) {
        const from = path[i];
        const to = path[i + 1];
        const dLng = to.lng - from.lng;
        const dLat = to.lat - from.lat;
        const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
        return (angle + 360) % 360;
      }
      accumulated += segLen;
    }
    return 0;
  }

  // ── Arrival prediction ───────────────────────────────────────────────────

  /**
   * Returns the progress fraction [0,1) of the path point closest to targetLatLng.
   */
  _progressOfLatLng(targetLatLng) {
    const path = this._path;
    if (path.length === 0) return 0;
    const totalLen = this._totalLength;
    if (totalLen === 0) return 0;

    let bestProgress = 0;
    let bestDist = Infinity;
    let accumulated = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const d = targetLatLng.distanceTo(path[i]);
      if (d < bestDist) {
        bestDist = d;
        bestProgress = accumulated / totalLen;
      }
      accumulated += path[i].distanceTo(path[i + 1]);
    }
    const dLast = targetLatLng.distanceTo(path[path.length - 1]);
    if (dLast < bestDist) {
      bestProgress = 1;
    }
    return bestProgress;
  }

  /**
   * Timestamp (ms since epoch) of the next simulated arrival of this bus
   * at the given targetLatLng.
   */
  nextArrivalAt(targetLatLng, nowMs = Date.now()) {
    const haltProgress = this._progressOfLatLng(targetLatLng);
    const currentProgress = this._progressAt(nowMs);
    let delta = haltProgress - currentProgress;
    if (delta <= 0) delta += 1;
    return nowMs + delta * this._cycleMinutes() * 60_000;
  }

  /**
   * Returns { halt, arrivalMs } for the next halt this bus will reach.
   */
  nextHaltArrival(nowMs = Date.now()) {
    const results = this.nextHaltArrivals(1, nowMs);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Returns up to n { halt, arrivalMs } objects for the next halts this bus will reach,
   * in order of arrival.
   */
  nextHaltArrivals(n = 3, nowMs = Date.now()) {
    const halts = this.route.haltList.filter((h) => h.latLng);
    if (halts.length === 0) return [];
    const currentProgress = this._progressAt(nowMs);
    const cycleMs = this._cycleMinutes() * 60_000;
    return halts
      .map((halt) => {
        const haltProgress = this._progressOfLatLng(halt.latLng);
        let delta = haltProgress - currentProgress;
        if (delta <= 0) delta += 1;
        return { halt, arrivalMs: nowMs + delta * cycleMs };
      })
      .sort((a, b) => a.arrivalMs - b.arrivalMs)
      .slice(0, n);
  }

  // ── Factory ──────────────────────────────────────────────────────────────

  /** Number of simulated buses spawned per route. */
  static BUSES_PER_ROUTE = 8;

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
