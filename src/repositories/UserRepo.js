const db = require("../services/DataBase");
const userCollcetion = "users";

class UserRepo {
  static async getUserByUsername(username) {
    return await db.getDocument(
      {
        username: username,
      },
      userCollcetion
    );
  }

  static async insertUser(user) {
    await db.insertDocument(user, userCollcetion);
  }
}

module.exports = UserRepo;
