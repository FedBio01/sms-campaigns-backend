class Sms {
  constructor(destNumber, message, creationTime) {
    this.destinationNumber = destNumber;
    this.message = message;
    this.status = "append";
    this.creationTime = creationTime;
    //this.sentTime; → campo creato in caso di successo di invio del messaggio
  }
}

module.exports = Sms;
