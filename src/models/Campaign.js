class Campaign {
  /**
   *
   * @param {string} name - name of the campaign
   * @param {string} creator - name of the user that created the campaign
   * @param {string} messageText - the text of every single message
   * @param {array} smsRef - array of sms
   * @param {luxon.DateTime} creationDate - timestamp of the creation of the campaign
   */
  constructor(name, creator, messageText, smsRef, totalSms, creationDate) {
    this.name = name; //univoco
    this.creator = creator;
    this.messageText = messageText;
    this.smss = smsRef;
    this.totalSms = totalSms;
    this.creationDate = creationDate;
    this.start = "not started";
    this.finish = "not finished";
  }
}

module.exports = Campaign;
