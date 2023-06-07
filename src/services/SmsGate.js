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
  sendCampaign(smsArray, onSuccess, onReject) {
    smsArray.forEach((sms) => {
      this.sendSms(sms, onSuccess, onReject);
    });
  }
  /*
  sendCampaign(smsArray, onSuccesCampaign, onRejectCampaign) {
    let message = smsArray[0].message;
    let arrayLenght = smsArray.length;
    let destinationNumbers = new Array();
    
    smsArray.forEach((sms) => {
      destinationNumbers.push({"dl_name": sms.destinationNumber});
    });
    console.log(destinationNumbers);
    let strigOfdestinations = destinationNumbers.join(";");
    console.log("stringanumeri: "+strigOfdestinations);
    try {
      console.log("sono quì")
      this.session.submit_multi(
        {
          dest_address: destinationNumbers,
          short_message: message,
        },
        (pdu) => {
          
            there'll be as many answer pdus as the elements in destinationNumbers array (i think), the single pdu reffered at the sending
            events of a sms will have a field named destination_addr filled with the corresponding phone destination number.
            i'm going to search for a sms object with that destinationNumber and pass it to Onsuccess/Onreject 
            callback 
            
          let pduReferredSms;
          smsArray.forEach((sms) => {
            if (sms.destinationNumber === pdu.destination_addr) {
              pduReferredSms = sms;
            }
          });
          console.log("pdu di risposta "+pdu)
          console.log("smsArray "+ smsArray)
          if (pdu.command_status === 0) {
            console.log("sono qui")
            return onSuccesCampaign(pduReferredSms);
          }
          console.log("pduRefferredSms "+pduReferredSms)
          return onRejectCampaign(pduReferredSms);
        }
      );
    } catch (error) {
      console.error(error);
    }
  }*/
}

module.exports = new SmsGate();
