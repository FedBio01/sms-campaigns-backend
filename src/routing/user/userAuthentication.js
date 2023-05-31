const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../../repositories/UserRepo");
const WrongParameterError = require("../../errors/WrongParameterError");

const keyPath = path.resolve("./certs/private.key");
const key = fs.readFileSync(keyPath);

const authentication = async (req, res, next) => {
  const reqPwd = req.body.password;
  const reqUsrName = req.body.username;
  //disaccoppiare la logica del db dal controllo delle credenziali
  //User.getUser(user)
  const user = await User.getUserByUsername(reqUsrName);
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
      next(new WrongParameterError("password errata"));
    }
  } else {
    next(new WrongParameterError("username errato"));
  }
};

module.exports = authentication;
