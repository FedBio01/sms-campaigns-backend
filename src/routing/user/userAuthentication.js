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

  const [user] = await UserRepo.getUserByUsername(reqUsrName);

  if (user != null) {
    const hash = user.password;
    if (await bcrypt.compare(reqPwd, hash)) {
      /*↓*/
      const userClone = Object.assign({}, user);
      delete userClone.password;
      delete userClone._id;
      /*↑*/
      const token = jwt.sign(userClone, key, { algorithm: "RS256" });
      return res.send({ token, user: userClone });
    } else {
      return next(new WrongParameterError("password errata"));
    }
  }
  return next(new WrongParameterError("username errato"));
};

module.exports = authentication;
