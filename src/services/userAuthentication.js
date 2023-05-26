const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const db = require("./DataBase");

const keyPath = path.resolve("./certs/private.key");
const key = fs.readFileSync(keyPath);

const authentication = async (req, res, next) => {
  const user = req.body.username;
  const pwd = req.body.password;
  if ((await db.getUser(user, pwd)) !== null) {
    const token = jwt.sign(
      {
        username: user,
        password: pwd,
      },
      key,
      { algorithm: "RS256" }
    );
    res.send({ token: token });
  } else {
    res.send("auth failed");
  }
};

module.exports = authentication;
