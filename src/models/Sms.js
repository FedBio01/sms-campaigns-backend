class Sms {
  /**
   *
   * @param {string} destNumber - destination number
   * @param {string} message - message of the sms
   * @param {luxon.DateTime} creationTime - timestamp of the creation of the sms
   * @param {string} campaign - campaign name
   */
  constructor(destNumber, message, creationTime, campaign) {
    this.destinationNumber = destNumber;
    this.message = message;
    this.status = "append";
    this.creationTime = creationTime;
    //this.sentTime; → campo creato in caso di successo di invio del messaggio
    this.campaign = campaign;
  }
}

module.exports = Sms;
