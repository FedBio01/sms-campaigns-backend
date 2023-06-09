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
  /*
  sendCampaign(smsArray, onSuccess, onReject) {
    smsArray.forEach((sms) => {
      const sleep = () => {
        return new Promise(resolve => setTimeout(resolve, 200))
      }
      this.sendSms(sms, onSuccess, onReject);
    });
  }
*/

  sendCampaign(smsArray, onSuccess, onReject) {
    let message = smsArray[0].message;
    let arrayLenght = smsArray.length;
    let destinationNumbers = new Array();

    smsArray.forEach((sms) => {
      destinationNumbers.push({ destination_addr: sms.destinationNumber });
    });
    console.log(destinationNumbers);
    //let strigOfdestinations = destinationNumbers.join(";");
    try {
      //console.log("sono quì")
      this.session.submit_multi(
        {
          dest_address: destinationNumbers,
          short_message: message,
        },
        (pdu) => {
          //let pduReferredSms;
          /*smsArray.forEach((sms) => {
            if (sms.destinationNumber === pdu.destination_addr) {
              pduReferredSms = sms;
            }
          });*/
          //pduReferredSms = smsArray[pdu.message_id];

          if (pdu.command_status === 0) {
            let pduUnsuccessField = pdu.unsuccess_sme;
            console.log("pdu.unsuccess_sme " + pdu.unsuccess_sme);
            console.log("failedMessages " + failedMessages);

            //creo due array, uno di messaggi da mandare onSuccess e uno da mandare Onreject
            let sentMessages = new Array();
            let rejectedMessages = new Array();
            //if(pduUnsuccessField.length > 0){
            /*
              failedMessages.forEach(failedMessage => {
                smsArray.forEach(sms => {
                  if(sms.destinationNumber === failedMessage.destination_addr){
                    onReject(sms);
                  }      
                });
              });
              */

            //popolo l'array dei messaggi rifiutati confrontando il numero del messaggio rifiutato con i messaggi di smsArray, se vi trovo un messaggio con tale numero
            //lo aggiungo all'array rejectedMessages
            smsArray.forEach((sms) => {
              pduUnsuccessField.forEach((element) => {
                if (element.dest_address === sms.destinationNumber) {
                  rejectedMessages.push(sms);
                }
              });
            });
            //popolo l'array dei messaggi inviati confrontando i messaggi inviati con i messaggi rifiutati, i messaggi che hanno destinationNumber differente da tutti i messaggi contenuti
            //nell'array rejectedMessages saranno andanti a buon fine e saranno inseriti nell'array sent messages
            smsArray.forEach((sms) => {
              let rejected = false;
              rejectedMessages.forEach((rejectedSms) => {
                if (sms.destinationNumber === rejectedSms.destinationNumber) {
                  rejected = true;
                }
              });
              if (!rejected) sentMessages.push(sms);
            });

            //}
            /*
            smsArray.forEach(sms =>{
              let present = false;
              failedMessages.forEach(failedMessage => {
                if(sms.destinationNumber === failedMessage.dest_address){
                  present = true;
                }
              })
              if(!present){
                onSuccess(sms)
              }   
            });
            return;
            */
            rejectedMessages.forEach((sms) => {
              onReject(sms);
            });
            sentMessages.forEach((sms) => {
              onSuccess(sms);
            });
            return;
          }
          smsArray.forEach((sms) => {
            onReject(sms);
          });
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new SmsGate();
