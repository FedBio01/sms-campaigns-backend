const express = require("express");
const router = express.Router();
const login = require("../routing/sign/login");
const CampaignRepo = require("../repositories/CampaignRepo");
const SmsRepo = require("../repositories/SmsRepo");
const Sms = require("../models/Sms");
const Campaign = require("../models/Campaign");
router.use(login);

const inizializeSms = async (req, res, next) => {
  /*
    
    */
  req.body.creator;
  req.body.name;
  req.body.messageText;
  req.body.numbers;

  let smsid = await SmsRepo.insertSms(
    new Sms(req.body.numbers, req.body.messageText)
  ).insertedId;
  let campaignResult = await CampaignRepo.insertCampagna(
    new Campaign(req.body.name, req.body.creator, req.body.messageText, smsid)
  );

  return res.send(campaignResult);
};

router.post("/campaign", inizializeSms);

module.exports = router;
