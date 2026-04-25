export default class User {
  constructor(name, address, cashBalance) {
    this.name = name;
    this.address = address;
    this.cashBalance = cashBalance; // LKR
  }

  /** Default dummy user */
  static getDefault() {
    return new User(
      "Nuwan Senaratna",
      "42 Galle Road, Colombo 3, Western Province",
      250.0,
    );
  }
}
