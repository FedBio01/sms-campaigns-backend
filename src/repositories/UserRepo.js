const db = require("../services/DataBase");
const userCollection = "users";

class UserRepo {
  static async getUserByUsername(username) {
    return await db.getDocument(
      {
        username: username,
      },
      userCollection
    );
  }

  static async insertUser(user) {
    await db.insertDocument(user, userCollection);
  }
}

module.exports = UserRepo;
