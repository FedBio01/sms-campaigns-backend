const express = require("express");
const SmsRepo = require("../repositories/SmsRepo");
const smsGate = require("../services/SmsGate");
const Sms = require("../models/Sms");
const router = express.Router();
const { DateTime } = require("luxon");
const CampaignRepo = require("../repositories/CampaignRepo");

const userCampaign = async (req, res, next) => {
  let creator = req.body.user.username;
  let campaignArray = await CampaignRepo.getMultipleCampaignByCreator(creator);
  res.send({ campaign: campaignArray });
};

router.get("/userCampaing", userCampaign);

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
    retrievedSms,
    "sent",
    DateTime.now().toISO()
  );
};

const onSuccessArray = async (sms) => {
  await SmsRepo.updateMultipleSmsStatusAndSentTime(
    sms,
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
  console.log("retrived sms " + retrievedSms);
  await SmsRepo.updateSmsStatus(retrievedSms, "rejected");
};

const onRejectArray = async (sms) => {
  console.log("retrived sms " + sms);
  await SmsRepo.updateMultipleSmsStatus(sms, "rejected");
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
  const campaing = req.body.campaign; //nome della campagna
  const retrivedCampaign = await CampaignRepo.getCampaignByName(campaing);
  //console.log(retrivedCampaign);
  const refArray = retrivedCampaign.smss;
  let smsArray = await SmsRepo.getMultipleSmsById(refArray);
  //console.log(smsArray);
  //smsGate.sendCampaign(smsArray, onSuccessArray, onRejectArray);

  let maxCap = 3;
  let upperbound = Math.ceil(smsArray.length / maxCap);

  for (let i = 0; i < upperbound; i++) {
    console.log(smsArray.slice(i * maxCap, i * maxCap + maxCap));
  }

  //smsGate.sendCampaign(smsArray, onSuccesCampaign, onRejectCampaign);
  res.send("campaign sent");
});

module.exports = router;
