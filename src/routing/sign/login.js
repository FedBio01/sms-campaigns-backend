const express = require("express");
const router = express.Router();
const userAuth = require("../user/userAuthentication");
const userReg = require("../user/userRegistration");

router.post("/signup", userReg);
router.post("/signin", userAuth);

module.exports = router;
