const { MongoClient } = require("mongodb");
const dbConfig = require("./argsParser");
const configuration = require(`${dbConfig}`);
const db_ip = configuration["db-ip"];

class DataBase {
  constructor() {
    this.uri = `mongodb://${db_ip}`;
    this.client = new MongoClient(this.uri);
    this.dbName = null;
  }

  async connection() {
    try {
      await this.client.connect();
      console.log("db connected");
      this.dbName = this.client.db("test");
    } catch (e) {
      console.error(e);
    }
  }

  async closeConnection() {
    await this.client.close();
    console.log("db connection closed");
  }

  async getDocument(value, collection) {
    return await this.dbName.collection(collection).findOne(value);
  }
  async insertDocument(value, collection) {
    await this.dbName.collection(collection).insertOne(value);
  }
}
module.exports = new DataBase();
