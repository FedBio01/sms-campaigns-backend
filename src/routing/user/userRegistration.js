const db = require("../../services/DataBase");
const UserRepo = require("../../repositories/UserRepo");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const WrongParameterError = require("../../errors/WrongParameterError");

const userRegistration = async (req, res, next) => {
  let user = new User(req.body.username, req.body.email, req.body.password);
  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);
  console.log(user);
  const pwd = await bcrypt.hash(user.password, salt);
  user.password = pwd;
  try {
    await UserRepo.insertUser(user);
  } catch (error) {
    console.error(error);
    return next(error);
  }
  res.send("registration successful");
};
module.exports = userRegistration;
