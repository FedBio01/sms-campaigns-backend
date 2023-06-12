class User {
  /**
   * @param {string} username
   * @param {string} email
   * @param {string} password
   */
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
module.exports = User;
