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

router.get("/user-campaing", userCampaign);

router.get("/test", (req, res, next) => {
  res.send("rotta di prova autorizzata");
  return next();
});

const onSuccess = async (sms) => {
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
  await SmsRepo.updateSmsStatus(retrievedSms, "rejected");
};

const onRejectArray = async (sms) => {
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

router.post("/send-sms", async (req, res, next) => {
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

router.post("/send-campaign", async (req, res, next) => {
  const campaing = req.body.campaign;
  const retrivedCampaign = await CampaignRepo.getCampaignByName(campaing);
  const refArray = retrivedCampaign.smss;
  let smsArray = await SmsRepo.getMultipleSmsById(refArray);
  await CampaignRepo.updateCampaignStartTime(
    retrivedCampaign,
    DateTime.now().toISO()
  );

  let maxCap = 2;
  let upperbound = Math.ceil(smsArray.length / maxCap);

  for (let i = 0; i < upperbound; i++) {
    let smsSlice = smsArray.slice(i * maxCap, i * maxCap + maxCap);
    new Promise((resolve, reject) => {
      setTimeout(() => {
        smsGate.sendCampaign(
          smsSlice,
          onSuccessArray,
          onRejectArray,
          updateCampaign
        );
        resolve();
      }, 200 * i);
    });
  }
  res.send({ message: "campaign sent" });
});

router.post("/userActivableCampaign", async (req, res, next) => {
  const username = req.body.user.username;
  let userActiveCampaign =
    await CampaignRepo.getMultipleCampaignNotActiveByCreator(username);
  res.send(userActiveCampaign);
});
module.exports = router;
