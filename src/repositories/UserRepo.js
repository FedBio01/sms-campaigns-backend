const db = require("../services/DataBase");
const userCollection = "users";

class UserRepo {
  static async getUserByUsername(username) {
    return await db.getSingleDocument(userCollection, {
      username: username,
    });
  }

  static async insertUser(user) {
    await db.insertSingleDocument(userCollection, user);
  }
}

module.exports = UserRepo;
