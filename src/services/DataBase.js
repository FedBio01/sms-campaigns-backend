const { MongoClient } = require("mongodb");
const dbConfig = require("./argsParser");
const configuration = require(`${dbConfig}`);
const db_ip = configuration["db-ip"];
const utilizedDB = "test";

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
      this.dbName = this.client.db(utilizedDB);
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
    return await this.dbName.collection(collection).insertOne(value);
  }

  /*
  modify a document in a collection
  collection: collection were the document is
  query: selection query of the document
  updateDoc: specify what field needs to be updated and how
  options: MongoDB options, undefined if not used
  */
  async modifyDocument(collection, query, updateDoc, options) {
    return await this.dbName
      .collection(collection)
      .updateOne(query, updateDoc, options);
  }

  /*
  return an aggregate vector of object that satisfie the pipeline
  collection: collection where the aggregate funcion is applied
  pipeline: pipeline query
  options: MondoDB options, undefined if not used
  */
  async aggregate(collection, pipeline, options) {
    return await this.dbName
      .collection(collection)
      .aggregate(pipeline, options);
  }
}
module.exports = new DataBase();
