const express = require("express");
const SmsRepo = require("../repositories/SmsRepo");
const smsGate = require("../services/SmsGate");
const Sms = require("../models/Sms");
const router = express.Router();
const { DateTime } = require("luxon");

router.get("/test", (req, res, next) => {
  res.send("rotta di prova autorizzata");
  return next();
});

const onSuccess = async (sms) => {
  console.log("onSucces " + sms.destinationNumber);
  let retrievedSms;
  try {
    retrievedSms = await SmsRepo.getSms(sms);
  } catch (error) {
    console.error(error);
  }
  await SmsRepo.updateSmsStatusAndSentTime(
    retrievedSms[0],
    "sent",
    DateTime.now().toISO()
  );
  //res.send({"text": "done"});
};

const onReject = async (sms) => {
  let retrievedSms;
  try {
    retrievedSms = await SmsRepo.getSms(sms);
  } catch (error) {
    console.error(error);
  }
  await SmsRepo.updateSmsStatus(retrievedSms, "sent");
  //res.send({"text": "error"});
};

router.post("/sendSms", async (req, res, next) => {
  const destNumber = req.body.destinationNumber;
  const message = req.body.message;
  let sms = new Sms(destNumber, message, DateTime.now().toISO());
  try {
    await SmsRepo.insertSms([sms]);
  } catch (error) {
    console.error(error);
  }
  smsGate.sendSms(sms, onSuccess, onReject);
  //res.send("done");
});

module.exports = router;
