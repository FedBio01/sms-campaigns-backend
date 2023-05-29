const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../../repositories/User");

const keyPath = path.resolve("./certs/private.key");
const key = fs.readFileSync(keyPath);

const authentication = async (req, res, next) => {
  const reqPwd = req.body.password;
  const reqUsrName = req.body.username;
  //disaccoppiare la logica del db dal controllo delle credenziali
  //User.getUser(user)
  const user = await User.getUser(reqUsrName);
  if (user != null) {
    const hash = user.password;
    if (await bcrypt.compare(reqPwd, hash)) {
      const token = jwt.sign(
        {
          username: user,
        },
        key,
        { algorithm: "RS256" }
      );
      return res.send({ token: token });
    } else {
      res.send("wrong password");
    }
  } else {
    res.send("wrong username");
  }
};

module.exports = authentication;
