const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const db = require("./DataBase");

const keyPath = path.resolve("./certs/private.key");
const key = fs.readFileSync(keyPath);

const authentication = async (req, res, next) => {
  const user = req.body.username;
  const pwd = req.body.password;
  //disaccoppiare la logica del db dal controllo delle credenziali
  //User.getUser(user)
  if ((await db.getUser(user, pwd)) !== null) {
    const token = jwt.sign(
      {
        username: user,
      },
      key,
      { algorithm: "RS256" }
    );
    return res.send({ token: token });
  } else {
    res.send("auth failed");
  }
};

module.exports = authentication;
