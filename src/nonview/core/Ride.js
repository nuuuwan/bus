/**
 * Represents an active bus ride by the user.
 */
export default class Ride {
  /** Flat fare charged when boarding, in LKR */
  static FARE_LKR = 30;

  /**
   * @param {Bus}  bus             — the bus the user boarded
   * @param {Halt} boardedAtHalt   — the halt where the user boarded
   * @param {number} boardedAtMs  — timestamp (ms) when the user boarded
   */
  constructor(bus, boardedAtHalt, boardedAtMs) {
    this.bus = bus;
    this.boardedAtHalt = boardedAtHalt;
    this.boardedAtMs = boardedAtMs;
    this.fare = Ride.FARE_LKR;
  }
}
