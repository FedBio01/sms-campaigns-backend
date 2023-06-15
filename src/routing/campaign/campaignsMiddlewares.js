const express = require("express");
const router = express.Router();
const { DateTime } = require("luxon");
const CampaignRepo = require("../../repositories/CampaignRepo");
const SmsRepo = require("../../repositories/SmsRepo");
const smsGate = require("../../services/SmsGate");
const Sms = require("../../models/Sms");
const Campaign = require("../../models/Campaign");

const onSuccess = async (sms) => {
  let retrievedSms;
  try {
    retrievedSms = await SmsRepo.getSms(sms);
  } catch (error) {
    console.error(error);
  }

  await SmsRepo.updateSmsStatusAndSentTime(
    retrievedSms,
    "sent",
    DateTime.now().toUTC().toISO()
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

const sendSms = async (req, res, next) => {
  const destNumber = req.body.destinationNumber;
  const message = req.body.message;
  let sms = new Sms(destNumber, message, DateTime.now().toUTC().toISO());
  try {
    await SmsRepo.insertSms(sms);
  } catch (error) {
    console.error(error);
  }
  smsGate.sendSms(sms, onSuccess, onReject);
  res.send("done");
};

const onSuccessArray = async (sms) => {
  //delivery time
  await SmsRepo.updateMultipleSmsStatusAndDeliveryTimeById(
    sms,
    "sent",
    DateTime.now().toUTC().toISO()
  );
};

const onRejectArray = async (sms) => {
  await SmsRepo.updateMultipleSmsStatusById(sms, "rejected");
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
    DateTime.now().toUTC().toISO()
  );
};

const sendCampaign = async (req, res, next) => {
  const campaing = req.body.campaign;
  const retrivedCampaign = await CampaignRepo.getCampaignByName(campaing);
  const refArray = retrivedCampaign.smss;
  let smsArray = await SmsRepo.getMultipleSmsById(refArray);
  let smsIds = smsArray.map((sms) => {
    return sms._id;
  });
  await CampaignRepo.updateCampaignStartTime(
    retrivedCampaign,
    DateTime.now().toUTC().toISO()
  );
  // 255 is the max numbers of sms that the sms gate can recieve with a pdu
  let maxCap = 2;
  let upperbound = Math.ceil(smsArray.length / maxCap);

  for (let i = 0; i < upperbound; i++) {
    let smsSlice = smsArray.slice(i * maxCap, i * maxCap + maxCap);
    let smsIdsSlice = smsIds.slice(i * maxCap, i * maxCap + maxCap);
    new Promise((resolve, reject) => {
      setTimeout(() => {
        SmsRepo.updateMultipleSmsSentTimeById(
          smsIdsSlice,
          DateTime.now().toUTC().toISO()
        );
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
};

const userCampaign = async (req, res, next) => {
  let creator = req.body.user.username;
  let campaignArray = await CampaignRepo.getMultipleCampaignByCreator(creator);
  res.send({ campaign: campaignArray });
};

const userActivableCampaign = async (req, res, next) => {
  const username = req.body.user.username;
  let userActiveCampaign =
    await CampaignRepo.getMultipleCampaignNotActiveByCreator(username);
  res.send(userActiveCampaign);
};

const visualizeCampaign = async (req, res, next) => {
  let prova = await CampaignRepo.getAllCampaign();
  res.send(prova);
};

const initializeCampaign = async (req, res, next) => {
  let creator = req.body.user.username;
  let campaignName = req.body.name;
  let messageText = req.body.message;
  let numbers = req.body.destinationNumbers;
  let creationTime = DateTime.now().toUTC().toISO();

  let smsArray = numbers.map((number) => {
    let sms = new Sms(number, messageText, creationTime, campaignName);
    return sms;
  });

  let smsids = await SmsRepo.insertMultipleSms(smsArray);

  let campaign = new Campaign(
    campaignName,
    creator,
    messageText,
    Object.values(smsids.insertedIds),
    smsArray.length,
    creationTime
  );
  let campaignResult = await CampaignRepo.insertCampaign(campaign);

  return res.send(campaignResult);
};

const getStatisticsByUser = async (req, res, next) => {
  let user = req.body.user.username;
  let result = await CampaignRepo.getAllCampaignStatisticsByUserStarted(user);
  res.send(result);
};

module.exports = {
  userCampaign,
  sendSms,
  sendCampaign,
  userActivableCampaign,
  visualizeCampaign,
  initializeCampaign,
  getStatisticsByUser,
};
