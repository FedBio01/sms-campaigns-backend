const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const UserRepo = require("../../repositories/UserRepo");
const WrongParameterError = require("../../errors/WrongParameterError");
const MissingParameterError = require("../../errors/MissingParameterError");

const keyPath = path.resolve("./certs/private.key");
const key = fs.readFileSync(keyPath);

const authentication = async (req, res, next) => {
  const reqPwd = req.body.password;
  const reqUsrName = req.body.username;

  if (reqPwd === undefined || reqUsrName === undefined) {
    return next(new MissingParameterError("parametri mancanti"));
  }

  const userDB = await UserRepo.getUserByUsername(reqUsrName);

  if (userDB != null) {
    const hash = userDB.password;
    if (await bcrypt.compare(reqPwd, hash)) {
      const user = Object.assign({}, userDB);
      delete user.password;

      const token = jwt.sign(user, key, { algorithm: "RS256" });
      return res.send({ token, user: user });
    } else {
      return next(new WrongParameterError("password errata"));
    }
  }
  return next(new WrongParameterError("username errato"));
};

module.exports = authentication;
