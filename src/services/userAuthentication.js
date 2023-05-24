const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const db = require("./DataBase");

const keyPath = path.resolve("./certs/private.key");
const key = fs.readFileSync(keyPath);

const authentication = (req, res, next) => {
  const user = req.body.username;
  const pwd = req.body.password;
  if (db.getUser(user, pwd) !== undefined) {
    const token = jwt.sign(
      {
        username: user,
        password: pwd,
      },
      key,
      { algorithm: "RS256" }
    );
    res.send({ token: token });
  }
  res.send("auth failed");
};

module.exports = authentication;
