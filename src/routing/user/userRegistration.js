const db = require("../../services/DataBase");
const User = require("../../repositories/UserRepo");
const bcrypt = require("bcrypt");
const WrongParameterError = require("../../errors/WrongParameterError");

const userRegistration = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const plainPwd = req.body.password;
  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);
  const pwd = await bcrypt.hash(plainPwd, salt);
  try {
    await User.insertUser(username, email, pwd);
  } catch (error) {
    console.error(error);
    return next(error);
  }
  res.send({ text: "registration successful" });
};
module.exports = userRegistration;
