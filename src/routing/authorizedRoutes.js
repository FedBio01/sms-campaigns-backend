const express = require("express");
const SmsRepo = require("../repositories/SmsRepo");
const smsGate = require("../services/SmsGate");
const Sms = require("../models/Sms");
const router = express.Router();

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
  await SmsRepo.updateSmsStatus(retrievedSms, "sent");
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
const onSuccesCampaign = async (smsArray) => {
  try {
    SmsRepo.updateSmsStatus(smsArray, "sent");
  } catch (error) {
    console.error(error);
  }
};
const onRejectCampaign = async (smsArray) => {
  try {
    SmsRepo.updateSmsStatus(smsArray, "rejected");
  } catch (error) {
    console.error(error);
  }
};
router.post("/sendSms", async (req, res, next) => {
  const destNumber = req.body.destinationNumber;
  const message = req.body.message;
  const sms = new Sms(destNumber, message);
  try {
    await SmsRepo.insertSms(sms);
  } catch (error) {
    console.error(error);
  }
  smsGate.sendSms(sms, onSuccess, onReject);
  res.send("done");
});
router.post("/sendCampaign", (req, res, next) => {
  const campaing = req.body.campaign;
  const refArray = campaing.smss;
  let smsArray = SmsRepo.getSmsById(refArray);
  smsGate.sendCampaign(smsArray, onSuccesCampaign, onRejectCampaign);
  res.send("campaign sent");
});

module.exports = router;
