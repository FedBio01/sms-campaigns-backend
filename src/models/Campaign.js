class Campaign {
  constructor(name, creator, messageText, smsRef) {
    this.name = name;
    this.creator = creator;
    this.messageText = messageText;
    this.sms = smsRef;
  }
}

module.exports = Campaign;
