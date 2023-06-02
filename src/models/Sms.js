class Sms {
  constructor(destNumber, message) {
    this.destinationNumber = destNumber;
    this.message = message;
    this.status = "append";
  }
}

module.exports = Sms;
