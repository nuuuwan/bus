export default class LatLng {
  static DEFAULT_COLOMBO = { lat: 6.9271, lng: 79.8612 };

  constructor(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }

  static fromDefault() {
    return new LatLng(LatLng.DEFAULT_COLOMBO.lat, LatLng.DEFAULT_COLOMBO.lng);
  }

  static fromString(latLngString) {
    const [lat, lng] = latLngString.split(",").map(parseFloat);
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
    const lat = this.lat.toFixed(4);
    const lng = this.lng.toFixed(4);
    return `${lat},${lng}`;
  }

  toArray() {
    return [this.lat, this.lng];
  }
}
