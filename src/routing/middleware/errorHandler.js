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

module.exports = errorLogger;
