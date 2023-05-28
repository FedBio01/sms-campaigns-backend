const express = require("express");
const router = express.Router();
const userAuth = require("../services/userAuthentication.js");
const userReg = require("../services/userRegistration.js");
router.post("/login", userAuth);
router.post("/signIn", userReg);
module.exports = router;
