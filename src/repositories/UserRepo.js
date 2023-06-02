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
  static async insertUser(user) {
    await db.insertDocument(
      {
        username: `${user.username}`,
        email: `${user.email}`,
        password: `${user.password}`,
      },
      "users"
    );
  }
}

module.exports = UserRepo;
