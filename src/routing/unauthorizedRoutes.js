const express = require("express");
const router = express.Router();
const login = require("../routing/sign/login");
const CampaignRepo = require("../repositories/CampaignRepo");
router.use(login);

router.get("/prova", async (req, res, next) => {
  let prova = await CampaignRepo.getAllCampign();
  res.send(prova);
});

const initializeCampaign = require("./initializeCampaign");
router.post("/initializeCampaign", initializeCampaign);

module.exports = router;
