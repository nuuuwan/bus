export default class LatLng {
  static DEFAULT_COLOMBO = { lat: 6.9271, lng: 79.8612 };

  constructor(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }

  static fromDefault() {
    return new LatLng(LatLng.DEFAULT_COLOMBO.lat, LatLng.DEFAULT_COLOMBO.lng);
  }

  static fromTuple(latLngTuple) {
    return new LatLng(latLngTuple[0], latLngTuple[1]);
  }

  static fromString(latLngString) {
    const [latPart, lngPart] = latLngString.split(",");

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

  toString() {
    const latAbs = Math.abs(this.lat).toFixed(4);
    const lngAbs = Math.abs(this.lng).toFixed(4);
    const latDir = this.lat >= 0 ? "N" : "S";
    const lngDir = this.lng >= 0 ? "E" : "W";
    return `${latAbs}${latDir},${lngAbs}${lngDir}`;
  }

  toArray() {
    return [this.lat, this.lng];
  }
}
