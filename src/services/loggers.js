const express = require("express");

const errorLogger = (error, req, res, next) => {
  const status = error.status || 500;
  console.error(error);

  res.status(status).send({
    name: error.name,
    status,
    message: error.message,
  });
};

const requestLogger = (req, res, next) => {
  console.log("request method :", req.method);
  console.log("request ip :", req.ip);
  return next();
};

module.exports = { errorLogger, requestLogger };
