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
