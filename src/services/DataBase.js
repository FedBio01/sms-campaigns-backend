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

  //single document

  /**
   * Get document from the Database
   * @param collection - collection were the document is
   * @param value - the object query
   * @returns required document or null
   */
  async getSingleDocument(collection, value) {
    return await this.dbName.collection(collection).findOne(value);
  }

  /**
   * Insert a document in the specified collection
   * @param collection - collection were the document is
   * @param value - document to insert
   * @returns object with aknowledjed boolean and insertedId
   */
  async insertSingleDocument(collection, value) {
    return await this.dbName.collection(collection).insertOne(value);
  }

  /** 
  Modify a document in a collection
  @param collection - collection were the document is
  @param query - selection query of the document
  @param updateDoc - specify what field needs to be updated and how
  @param options - MongoDB options, undefined if not used
  @returns object with information about the specification
  */
  async modifySingleDocument(collection, query, updateDoc, options) {
    return await this.dbName
      .collection(collection)
      .updateOne(query, updateDoc, options);
  }

  //multiple documents

  /**
   * Get documents from the Database
   * @param collection - collection were the documents are
   * @param {array} value - the object query
   * @returns required document or null
   */
  async getMultipleDocuments(collection, value) {
    return await this.dbName.collection(collection).find(value).toArray();
  }

  /**
   * Insert documents in the specified collection
   * @param collection - collection were the documents are
   * @param {array} value - array of documents to insert
   * @returns object with aknowledjed boolean and an object of ids inserted
   */
  async insertMultipleDocuments(collection, value) {
    return await this.dbName.collection(collection).insertMany(value);
  }

  /** 
  Modify documents in a collection
  @param collection - collection were the documents are
  @param query - selection query of the document
  @param updateDoc - specify what field needs to be updated and how
  @param options - MongoDB options, undefined if not used
  @returns object with information about the specification
  */
  async modifyMultipleDocuments(collection, query, updateDoc, options) {
    return await this.dbName
      .collection(collection)
      .updateMany(query, updateDoc, options);
  }

  /** 
  Return an aggregate vector of object that satisfie the pipeline
  @param {Object} collection - collection where the aggregate funcion is applied
  @param pipeline - pipeline query
  @param options - MondoDB options, undefined if not used
  @returns object structured with the pipeline specification
  */
  async aggregate(collection, pipeline, options) {
    return await this.dbName
      .collection(collection)
      .aggregate(pipeline, options)
      .toArray();
  }
}
module.exports = new DataBase();
