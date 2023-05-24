const { MongoClient } = require("mongodb");
const configuration = require("../../configurations/configuration.json");
const db_ip = configuration["db-ip"];
//const uri = "mongodb://10.200.200.20:27017"
//const client = new MongoClient(uri)

class DataBase {
  constructor() {
    this.uri;
    this.client;
  }

  uri = "mongodb://10.200.200.20:27017";
  client = new MongoClient(uri);

  async connection() {
    try {
      await this.client.connect();
      console.log("db connected");
    } catch (e) {
      console.error(e);
    }
  }

  async closeConnection() {
    await this.client.close();
    console.log("db connection closed");
  }

  async getUser(userName, password) {
    const collection = this.client.db("test").collection("users");
    return await collection.findOne({
      username: userName,
      password: password,
    });
  }
}
module.exports = new DataBase();
