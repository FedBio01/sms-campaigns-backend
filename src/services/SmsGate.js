const { forEach } = require("lodash");
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

  sendCampaign(smsArray, onSuccess, onReject, updateCampaign) {
    let message = smsArray[0].message;
    let campaignName = smsArray[0].campaign;
    let destinationNumbers = new Array();

    smsArray.forEach((sms) => {
      destinationNumbers.push({ destination_addr: sms.destinationNumber });
    });
    try {
      this.session.submit_multi(
        {
          dest_address: destinationNumbers,
          short_message: message,
        },
        (pdu) => {
          if (pdu.command_status !== 0) {
            //se non va a buon fine
            let rejectArray = smsArray.map((sms) => {
              return sms._id;
            });
            onReject(rejectArray);
            updateCampaign(campaignName);
            return;
          }
          let pduUnsuccessField = pdu.unsuccess_sme;
          const smsIdSend = new Array();
          const smsIdReject = new Array();
          let isRejected = false;
          smsArray.forEach((sms) => {
            pduUnsuccessField.forEach((remove) => {
              if (sms.destinationNumber === remove.destination_addr) {
                isRejected = true;
                return;
              }
            });
            if (isRejected) {
              smsIdReject.push(sms._id);
            } else {
              smsIdSend.push(sms._id);
            }
            isRejected = false;
          });
          onSuccess(smsIdSend);
          onReject(smsIdReject);
          updateCampaign(campaignName);
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new SmsGate();
