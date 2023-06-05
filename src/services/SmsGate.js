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
            return onSuccess(sms);
          }
          return onReject(sms);
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
  sendCampaign(smsArray, onSuccesCampaign, onRejectCampaign) {
    let message = smsArray[0].message;
    let arrayLenght = smsArray.length;
    let destinationNumbers = new Array(arrayLenght);
    smsArray.foreach((sms) => {
      destinationNumbers.push(sms.destinationNumber);
    });
    try {
      this.session.submit_multi(
        {
          dest_address: destinationNumbers,
          short_message: message,
        },
        (pdu) => {
          if (pdu.command_status === 0) {
            return onSuccesCampaign(smsArray);
          }
          return onRejectCampaign(smsArray);
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new SmsGate();
