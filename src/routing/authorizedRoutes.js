const express = require("express");

const router = express.Router();

router.get("/test", (req, res, next) => {
  res.send("rotta di prova autorizzata");
  return next();
});

module.exports = router;

console.log("cuai");
