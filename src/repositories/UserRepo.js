const db = require("../services/DataBase");
const userCollcetion = "users";

class UserRepo {
  static async getUserByUsername(username) {
    return await db.getSingleDocument(userCollcetion, {
      username: username,
    });
  }

  static async insertUser(user) {
    await db.insertSingleDocument(userCollcetion, user);
  }
}

module.exports = UserRepo;
