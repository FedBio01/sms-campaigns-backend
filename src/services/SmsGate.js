var smpp = require("smpp");
class smsGate {
  session;
  constructor() {
    this.url = "smpp://10.69.11.249:8003";
    this.system_id = "42396";
    this.password = "SMSG4T3";
  }
  connect() {
    try {
      this.session = smpp.connect(
        {
          url: this.url,
          auto_enquire_link_period: 10000,
          debug: true,
        },
        () => {
          console.log("SMS_Gate connected");
          this.session.bind_transceiver({
            system_id: this.system_id,
            password: this.password,
          });
        }
      );
    } catch (error) {
      console.error(e);
    }
  }
  sendSms(sms, onSucces, onReject) {
    try {
      session.submit_sm(
        {
          destinationAddr: sms.destinationNum,
          shortMessage: sms.message,
        },
        (pdu) => {
          if (pdu.command_status === 0) {
            console.log(pdu.message_id);
            return onSucces();
          }
          return onReject();
        }
      );
    } catch (error) {
      console.error(e);
    }
  }
}

module.exports = new smsGate();
