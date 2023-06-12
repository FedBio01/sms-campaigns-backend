const express = require("express");
const router = express.Router();
const login = require("../routing/sign/login");
const CampaignRepo = require("../repositories/CampaignRepo");
router.use(login);

router.get("/visualizeCampaign", async (req, res, next) => {
  let prova = await CampaignRepo.getAllCampaign();
  res.send(prova);
});

const initializeCampaign = require("./initializeCampaign");
router.post("/initializeCampaign", initializeCampaign);

router.post("/getStatisticsByUser", async (req, res, next) => {
  let user = req.body.user.username;
  let result = await CampaignRepo.getAllCampaignStatisticsByUser(user);
  console.log(result);
  res.send(result);
});

module.exports = router;
