const db = require("../services/DataBase");

class UserRepo {
  static async getUserByUsername(username) {
    return await db.getDocument(
      {
        username: username,
      },
      "users"
    );
  }
  static async insertUser(username, password) {
    await db.insertDocument(
      {
        _id: username,
        username: username,
        password: password,
      },
      "users"
    );
  }
}

module.exports = UserRepo;
