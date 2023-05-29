const { MongoClient } = require("mongodb");
const dbConfig = require("./argsParser");
const configuration = require(`../${dbConfig}`);
const db_ip = configuration["db-ip"];

class DataBase {
  constructor() {
    this.uri = `mongodb://${db_ip}:27017`;
    this.client = new MongoClient(this.uri);
  }

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

  async getDocument(value, collection) {
    return await this.client.db("test").collection(collection).findOne(value);
  }
  async insertDocument(value, collection) {
    await this.client.db("test").collection(collection).insertOne(value);
  }
}
module.exports = new DataBase();
