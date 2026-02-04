export default class LatLng {
  static DEFAULT_COLOMBO = { lat: 6.9271, lng: 79.8612 };

  constructor(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }

  toString() {
    const latAbs = Math.abs(this.lat).toFixed(4);
    const lngAbs = Math.abs(this.lng).toFixed(4);
    const latDir = this.lat >= 0 ? "N" : "S";
    const lngDir = this.lng >= 0 ? "E" : "W";
    return `${latAbs}${latDir}-${lngAbs}${lngDir}`;
  }

  get id() {
    return this.toString();
  }

  static fromDefault() {
    return new LatLng(LatLng.DEFAULT_COLOMBO.lat, LatLng.DEFAULT_COLOMBO.lng);
  }

  static fromTuple(latLngTuple) {
    return new LatLng(latLngTuple[0], latLngTuple[1]);
  }

  static fromString(latLngString) {
    const [latPart, lngPart] = latLngString.split("-");

    let lat = parseFloat(latPart);
    if (latPart.endsWith("S")) {
      lat = -Math.abs(lat);
    } else if (latPart.endsWith("N")) {
      lat = Math.abs(lat);
    }

    let lng = parseFloat(lngPart);
    if (lngPart.endsWith("W")) {
      lng = -Math.abs(lng);
    } else if (lngPart.endsWith("E")) {
      lng = Math.abs(lng);
    }

    return new LatLng(lat, lng);
  }

  static async fromGeolocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(
            new LatLng(position.coords.latitude, position.coords.longitude),
          );
        },
        (error) => {
          reject(error);
        },
      );
    });
  }

  toArray() {
    return [this.lat, this.lng];
  }

  // Calculate distance to another LatLng in kilometers using Haversine formula
  distanceTo(other) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((other.lat - this.lat) * Math.PI) / 180;
    const dLng = ((other.lng - this.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((this.lat * Math.PI) / 180) *
        Math.cos((other.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
