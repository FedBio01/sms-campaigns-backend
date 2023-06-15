class Sms {
  /**
   * @param {string} destNumber - destination number
   * @param {string} message - message of the sms
   * @param {string} status - status of the sms
   * @param {luxon.DateTime} creationTime - timestamp of the creation of the sms
   * @param {string} campaign - campaign name
   */
  constructor(destNumber, message, creationTime, campaign) {
    this.destinationNumber = destNumber;
    this.message = message;
    this.status = "append";
    this.creationTime = creationTime;
    this.sentTime = "null";
    this.deliveryTime = "null";
    this.campaign = campaign;
  }
}

module.exports = Sms;
