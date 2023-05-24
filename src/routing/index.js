const express = require("express");
const authorizedRoutes = require("./authorizedRoutes.js");
const unauthorizedRoutes = require("./unauthorizedRoutes.js");
const authorize = require("../services/authorize.js");
const router = express.Router();

router.use(unauthorizedRoutes);

router.use(authorize);

router.use(authorizedRoutes);

module.exports = router;
