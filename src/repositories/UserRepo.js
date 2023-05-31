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
  static async insertUser(username, email, password) {
    await db.insertDocument(
      {
        username: username,
        email: email,
        password: password,
      },
      "users"
    );
  }
}

module.exports = UserRepo;
