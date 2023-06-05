class Sms {
  constructor(destNumber, message, creationTime) {
    this.destinationNumber = destNumber;
    this.message = message;
    this.status = "append";
    this.creationTime = creationTime;
  }
}

module.exports = Sms;
