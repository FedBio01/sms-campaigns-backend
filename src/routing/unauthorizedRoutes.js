const express = require("express");
const router = express.Router();
const userAuth = require("../services/userAuthentication.js");

router.post("/login", userAuth);

module.exports = router;
