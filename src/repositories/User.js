const db = require("../services/DataBase");

class User {
  static async getUser(username) {
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
        username: username,
        password: password,
      },
      "users"
    );
  }
}

module.exports = User;
