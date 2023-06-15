const { MongoClient, ObjectId } = require("mongodb");
const db = require("../services/DataBase");
const { DateTime } = require("luxon");
const smsCollection = "sms";

class SmsRepo {
  //get single

  /**
   * query the db for the existence of the sms
   * @param {Sms} sms - array of sms to get from the database
   * @returns an array contenent the sms
   */
  static async getSms(sms) {
    return await db.getSingleDocument(smsCollection, sms);
  }

  //get multiple
  /**
   *get multiple sms by the given id array
   * @param {ObjectId()} smsArrayId - array of id
   * @returns array of sms
   */
  static async getMultipleSmsById(smsArrayId) {
    return await db.getMultipleDocuments(smsCollection, {
      _id: {
        $in: smsArrayId,
      },
    });
  }
  //insert single
  /**
   * insert the sms given in the database
   * @param {Sms} sms - vector of sms to insert in the database
   * @returns object with aknowledged status and inserted ids of the sms
   */
  static async insertSms(sms) {
    return await db.insertSingleDocument(smsCollection, sms);
  }
  //insert multiple

  /**
   * insert multiple sms in the db
   * @param {Array} sms array of sms
   * @returns object with aknowledged status and inserted ids of the sms
   */
  static async insertMultipleSms(sms) {
    return await db.insertMultipleDocuments(smsCollection, sms);
  }

  //modify single

  /**
   * update the sms status field
   * @param {Sms} sms - sms to update
   * @param status - status value
   */
  static async updateSmsStatus(sms, status) {
    await db.modifySingleDocument(
      smsCollection,
      sms,
      {
        $set: { status: status },
      },
      null
    );
  }

  /**
   * update the sms status and time
   * @param {Sms} sms - sms to update
   * @param {String} status - status
   * @param time - time
   */
  static async updateSmsStatusAndSentTime(sms, status, time) {
    await db.modifySingleDocument(
      smsCollection,
      sms,
      {
        $set: { sentTime: time, status: status },
      },
      { upsert: true }
    );
  }

  //modify multiple

  /**
   * update multiple sms status
   * @param {Array} smsId
   * @param {string} status
   */
  static async updateMultipleSmsStatusById(smsId, status) {
    await db.modifyMultipleDocuments(
      smsCollection,
      {
        _id: {
          $in: smsId,
        },
      },
      {
        $set: { status: status },
      },
      null
    );
  }

  /**
   * Modify multiple sms status and deliveytime by id
   * @param {Array} smsIds
   * @param {String} status
   * @param {DateTime.now().toUTC().toISO()} time
   */
  static async updateMultipleSmsStatusAndDeliveryTimeById(
    smsIds,
    status,
    time
  ) {
    await db.modifyMultipleDocuments(
      smsCollection,
      {
        _id: {
          $in: smsIds,
        },
      },
      {
        $set: { deliveryTime: time, status: status },
      },
      { upsert: true }
    );
  }

  /**
   * update sent time by smsid
   * @param {*} smsIds
   * @param {*} time
   */
  static async updateMultipleSmsSentTimeById(smsIds, time) {
    await db.modifyMultipleDocuments(
      smsCollection,
      {
        _id: {
          $in: smsIds,
        },
      },
      {
        $set: { sentTime: time },
      },
      { upsert: true }
    );
  }
}

module.exports = SmsRepo;
