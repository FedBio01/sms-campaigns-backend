const db = require("./DataBase");
const User = require("../repositories/User");
const bcrypt = require("bcrypt");
const userRegistration = async (req, res, next) => {
  const user = req.body.username;
  const plainPwd = req.body.password;
  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);
  const pwd = await bcrypt.hash(plainPwd, salt);
  await User.insertUser(user, pwd);
  res.send("registration done");
};
module.exports = userRegistration;
