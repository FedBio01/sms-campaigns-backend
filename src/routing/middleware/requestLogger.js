const express = require("express");

const requestLogger = (req, res, next) => {
  console.log("request method :", req.method);
  console.log("request ip :", req.ip);
  return next();
};

module.exports = requestLogger;
