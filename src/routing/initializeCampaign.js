const CampaignRepo = require("../repositories/CampaignRepo");
const SmsRepo = require("../repositories/SmsRepo");
const Sms = require("../models/Sms");
const Campaign = require("../models/Campaign");
const { DateTime } = require("luxon");

const initializeCampaign = async (req, res, next) => {
  let creator = req.body.user.username;
  let campaignName = req.body.name;
  let messageText = req.body.message;
  let numbers = req.body.destinationNumbers;
  let creationTime = DateTime.now().toISO();

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

module.exports = initializeCampaign;
