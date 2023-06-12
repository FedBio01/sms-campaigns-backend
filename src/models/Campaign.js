class Campaign {
  constructor(name, creator, messageText, smsRef) {
    this.name = name;
    this.creator = creator;
    this.messageText = messageText;
    this.smss = smsRef;
    this.totalSms = totalSms;
    this.creationDate = creationDate;
    this.isStarted = false;
    this.start = "not started";
    this.finish = "not finished";
  }
}

module.exports = Campaign;
