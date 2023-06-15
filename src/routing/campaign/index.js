const express = require("express");
const campaignsMiddleware = require("./campaignsMiddlewares");
const router = express.Router();

router.get("/user-campaign", campaignsMiddleware.userCampaign);

router.get("/visualize-campaign", campaignsMiddleware.visualizeCampaign);

router.post("/send-sms", campaignsMiddleware.sendSms);

router.post("/send-campaign", campaignsMiddleware.sendCampaign);

router.post(
  "/user-activable-campaign",
  campaignsMiddleware.userActivableCampaign
);

router.post("/initialize-campaign", campaignsMiddleware.initializeCampaign);

router.post("/get-statistics-by-user", campaignsMiddleware.getStatisticsByUser);

module.exports = router;
