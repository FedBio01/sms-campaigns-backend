const db = require("../../services/DataBase");
const User = require("../../repositories/User");
const bcrypt = require("bcrypt");
const WrongParameterError = require("../../errors/WrongParameterError");

const userRegistration = async (req, res, next) => {
  const user = req.body.username;
  const plainPwd = req.body.password;
  /*let userDocument
  try {
    userDocument = await User.getUser(user)
    console.log(userDocument)
  } catch (error) {
    console.error(error)
  }
  if(userDocument != null){
    return next(new WrongParameterError("username already in use"))
  }*/
  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);
  const pwd = await bcrypt.hash(plainPwd, salt);
  try {
    await User.insertUser(user, pwd);
  } catch (error) {
    console.error(error);
    return next(new WrongParameterError("username already in use"));
  }
  res.send("registration succesfull");
};
module.exports = userRegistration;
