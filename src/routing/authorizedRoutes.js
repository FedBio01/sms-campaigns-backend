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
  console.log("onSuccess " + sms.destinationNumber);
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
};

const onReject = async (sms) => {
  let retrievedSms;
  try {
    retrievedSms = await SmsRepo.getSms(sms);
  } catch (error) {
    console.error(error);
  }
  await SmsRepo.updateSmsStatus(retrievedSms, "rejected");
};
/*
const onSuccesCampaign = async (sms) => {
  let retrivedArray;
  try {
    retrivedArray = await SmsRepo.getSms(sms); //chiedere
  } catch (error) {
    console.error(error);
  }
  await SmsRepo.updateSmsStatus(sms, "sent");
};

const onRejectCampaign = async (sms) => {
  let retrivedArray;
  try {
    retrivedArray = await SmsRepo.getSms(sms);
  } catch (error) {
    console.error(error);
  }
  await SmsRepo.updateSmsStatus(sms, "rejected");
};
*/
router.post("/sendSms", async (req, res, next) => {
  const destNumber = req.body.destinationNumber;
  const message = req.body.message;
  const sms = new Sms(destNumber, message, DateTime.now().toISO());
  try {
    await SmsRepo.insertSms(sms);
  } catch (error) {
    console.error(error);
  }
  smsGate.sendSms(sms, onSuccess, onReject);
  res.send("done");
});

router.post("/sendCampaign", async (req, res, next) => {
  const campaing = req.body.campaign;
  const refArray = campaing.smss;
  let smsArray = await SmsRepo.getSmsById(refArray);
  console.log(smsArray);
  smsGate.sendCampaign(smsArray, onSuccess, onReject);
  //smsGate.sendCampaign(smsArray, onSuccesCampaign, onRejectCampaign);
  res.send("campaign sent");
});

module.exports = router;
