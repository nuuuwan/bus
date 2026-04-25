/**
 * Represents a bus ride by the user — active or completed.
 */
export default class Ride {
  /** Base fare charged when boarding, in LKR */
  static FARE_BASE_LKR = 10;
  /** Additional fare per minute, in LKR */
  static FARE_PER_MINUTE_LKR = 2;
  /** Additional fare per km (straight-line from boarding halt), in LKR */
  static FARE_PER_KM_LKR = 8;

  /**
   * @param {Bus}    bus               — the bus boarded
   * @param {Halt}   boardedAtHalt     — halt where user boarded
   * @param {number} boardedAtMs       — timestamp (ms) when boarded
   * @param {Halt|null}   alightedAtHalt — halt where user alighted (null = active)
   * @param {number|null} alightedAtMs  — timestamp (ms) when alighted (null = active)
   */
  constructor(
    bus,
    boardedAtHalt,
    boardedAtMs,
    alightedAtHalt = null,
    alightedAtMs = null,
  ) {
    this.bus = bus;
    this.boardedAtHalt = boardedAtHalt;
    this.boardedAtMs = boardedAtMs;
    this.alightedAtHalt = alightedAtHalt;
    this.alightedAtMs = alightedAtMs;
  }

  get isActive() {
    return this.alightedAtMs === null;
  }

  /** Duration in ms. Uses nowMs for active rides. */
  durationMs(nowMs = Date.now()) {
    return Math.max(0, (this.alightedAtMs ?? nowMs) - this.boardedAtMs);
  }

  /**
   * Dynamic fare at a given moment (or at alight time for completed rides).
   * Formula: base + per-minute + per-km (straight-line from boarding halt).
   */
  fareAt(nowMs = Date.now()) {
    const effectiveMs = this.alightedAtMs ?? nowMs;
    const minutes = this.durationMs(effectiveMs) / 60_000;
    const boardLatLng = this.boardedAtHalt?.latLng;
    const currentPos = this.bus.latLngAt(effectiveMs);
    const km =
      boardLatLng && currentPos ? boardLatLng.distanceTo(currentPos) : 0;
    return (
      Math.round(
        (Ride.FARE_BASE_LKR +
          Ride.FARE_PER_MINUTE_LKR * minutes +
          Ride.FARE_PER_KM_LKR * km) *
          100,
      ) / 100
    );
  }

  /** Convenience getter — returns fare at effective time. */
  get fare() {
    return this.fareAt();
  }

  /** Returns a completed copy of this ride. */
  withAlight(halt, ms) {
    return new Ride(this.bus, this.boardedAtHalt, this.boardedAtMs, halt, ms);
  }
}
