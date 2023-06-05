const args = require("./argsParser");
const configuration = require(`${args}`);
const configUrl = configuration["sms-gate-url"];
const configSysId = configuration["sms-gate-systemid"];
const configPwd = configuration["sms-gate-password"];
var smpp = require("smpp");
class SmsGate {
  session;
  constructor() {
    this.url = configUrl;
    this.system_id = configSysId;
    this.password = configPwd;
  }
  connect() {
    try {
      this.session = smpp.connect(
        {
          url: this.url,
          auto_enquire_link_period: 10000,
          debug: false,
        },
        (pdu) => {
          console.log("SMS_Gate connected");
          this.session.bind_transceiver(
            {
              system_id: this.system_id,
              password: this.password,
            },
            () => {
              if (pdu.command_status === 0) console.log("successfully bound");
            }
          );
        }
      );
    } catch (error) {
      console.error(e);
    }
  }
  sendSms(sms, onSuccess, onReject) {
    console.log("sendSms" + sms.destinationNumber);
    let smsDestinationNum = sms.destinationNumber;
    let smsMessage = sms.message;
    try {
      this.session.submit_sm(
        {
          destination_addr: smsDestinationNum,
          short_message: smsMessage,
        },
        (pdu) => {
          if (pdu.command_status === 0) {
            console.log("in pducallback " + sms.destinationNumber);
            console.log("pdu id:" + pdu.message_id);

            return onSuccess(sms);
          }
          return onReject(sms);
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new SmsGate();
