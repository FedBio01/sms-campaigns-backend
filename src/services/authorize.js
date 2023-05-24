const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");

const publicCrtPath = path.resolve("./certs/public.crt");
const publicCrt = fs.readFileSync(publicCrtPath);

const authorize = (req, res, next) => {
  const token = req.header("Authorization")
    ? req.header("Authorization").split(" ")[1]
    : null;

  jwt.verify(token, publicCrt);
  return next();
};
module.exports = authorize;
