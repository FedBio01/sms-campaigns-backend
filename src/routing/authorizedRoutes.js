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
  console.log("retrived sms " + retrievedSms);
  await SmsRepo.updateSmsStatus(retrievedSms, "rejected");
};

const onRejectArray = async (sms) => {
  console.log("retrived sms reject " + sms);
  await SmsRepo.updateMultipleSmsStatus(sms, "rejected");
};

const updateCampaign = async (campaign) => {
  let retrievedCampaign;
  try {
    retrievedCampaign = await CampaignRepo.getCampaignByName(campaign);
  } catch (error) {
    console.error(error);
  }
  await CampaignRepo.updateCampaignEndTime(
    retrievedCampaign,
    DateTime.now().toISO()
  );
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
  res.send("done");
});

router.post("/sendCampaign", async (req, res, next) => {
  const campaing = req.body.campaign; //nome della campagna
  console.log(campaing)
  const retrivedCampaign = await CampaignRepo.getCampaignByName(campaing);
  console.log(retrivedCampaign);
  const refArray = retrivedCampaign.smss;
  let smsArray = await SmsRepo.getMultipleSmsById(refArray);
  //console.log(smsArray);
  await CampaignRepo.updateCampaignStartTime(retrivedCampaign, DateTime.now().toISO());
  smsGate.sendCampaign(smsArray, onSuccessArray, onRejectArray, updateCampaign);
  //await CampaignRepo.updateCampaignEndTime(retrivedCampaign, DateTime.now().toISO());
  //smsGate.sendCampaign(smsArray, onSuccesCampaign, onRejectCampaign);
  res.send({message: "campaign sent"});
});

router.post("/userActivableCampaign", async (req,res,next) =>{
  const username = req.body.user.username
  console.log(username)
  let userActiveCampaign = await CampaignRepo.getMultipleCampaignNotActiveByCreator(username)
  res.send(userActiveCampaign) 
})
module.exports = router;
*/
