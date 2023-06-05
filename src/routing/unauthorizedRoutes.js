const express = require("express");
const router = express.Router();
const login = require("../routing/sign/login");
const CampaignRepo = require("../repositories/CampaignRepo");
const SmsRepo = require("../repositories/SmsRepo");
const Sms = require("../models/Sms");
const Campaign = require("../models/Campaign");
const { DateTime } = require("luxon");
router.use(login);

const inizializeSms = async (req, res, next) => {
  /*
    
    */
  let creator = req.body.creator;
  let name = req.body.name;
  let messageText = req.body.messageText;
  let numbers = req.body.numbers;
  let creationTime = DateTime.now().toISO();
  let smsArray = numbers.map((number) => {
    return {
      name: name,
      destinationNumber: number,
      message: messageText,
      status: "append",
      creationTime: creationTime,
    };
  });
  console.log(smsArray);
  let smsids = await SmsRepo.insertSms(smsArray);
  let ids = smsids.insertedIds;
  let campagna = new Campaign(
    req.body.name,
    req.body.creator,
    req.body.messageText,
    Object.values(ids)
  );
  let campaignResult = await CampaignRepo.insertCampagna([campagna]);

  return res.send(campaignResult);
};

router.post("/campaign", inizializeSms);

module.exports = router;
