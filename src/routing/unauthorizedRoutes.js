const express = require("express");
const router = express.Router();
const login = require("../routing/sign/login");

router.use(login);

module.exports = router;
