const express = require("express");
const router = express.Router();
const campaign = require("./campaign/index");

router.use("/campaign", campaign);

module.exports = router;
