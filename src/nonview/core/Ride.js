/**
 * Represents a bus ride by the user — active or completed.
 */
export default class Ride {
  /** Flat fare charged when boarding, in LKR */
  static FARE_LKR = 30;

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
    this.fare = Ride.FARE_LKR;
  }

  get isActive() {
    return this.alightedAtMs === null;
  }

  /** Duration in ms. Uses nowMs for active rides. */
  durationMs(nowMs = Date.now()) {
    return Math.max(0, (this.alightedAtMs ?? nowMs) - this.boardedAtMs);
  }

  /** Returns a completed copy of this ride. */
  withAlight(halt, ms) {
    return new Ride(this.bus, this.boardedAtHalt, this.boardedAtMs, halt, ms);
  }
}
