const { MongoClient, ObjectId } = require("mongodb");
const db = require("../services/DataBase");
const smsCollection = "sms";

class SmsRepo {
  //get single
  static async getSingleSms(sms) {
    return await db.getSingleDocument(smsCollection, sms);
  }
  /**
   * query the db for the existence of the sms
   * @param {Sms} sms - array of sms to get from the database
   * @returns an array contenent the sms
   */
  static async getSms(sms) {
    return await db.getSingleDocument(smsCollection, sms);
  }

  /**
   * get sms from the id
   * @param {ObjectId()} smsIds - array of sms ids
   * @returns array of sms object
   */
  static async getSmsById(smsId) {
    return await db.getSingleDocument(smsCollection, {
      _id: {
        $in: smsId,
      },
    });
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
  /**
   * insert multiple sms in the db
   * @param {Array} sms array of sms
   * @returns object with aknowledged status and inserted ids of the sms
   */
  //insert multiple
  static async insertMultipleSms(sms) {
    return await db.insertMultipleDocuments(smsCollection, sms);
  }
  //modify single
  /**
   * update the sms status field
   * @param {Sms} sms - sms to update
   * @param valore - status value
   */
  static async updateSmsStatus(sms, valore) {
    await db.modifySingleDocument(
      smsCollection,
      sms,
      {
        $set: { status: valore },
      },
      null
    );
  }
  /**
   * update the sms status field
   * @param {Sms} sms - sms to update
   * @param status - status
   */
  static async updateSmsStatusByCampaign(sms, status) {
    const campaign = sms.campaign;
    await db.modifySingleDocument(
      smsCollection,
      {
        campaign: campaign,
      },
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
   * @param {Array} sms
   * @param {string} valore
   */
  static async updateMultipleSmsStatus(sms, valore) {
    await db.modifyMultipleDocuments(
      smsCollection,
      {
        _id: {
          $in: sms,
        },
      },
      {
        $set: { status: valore },
      },
      null
    );
  }
  /**
   *
   * @param {Array} sms
   * @param {String} status
   * @param {luxon.DateTime} time
   */
  static async updateMultipleSmsStatusAndSentTime(sms, status, time) {
    await db.modifyMultipleDocuments(
      smsCollection,
      {
        _id: {
          $in: sms,
        },
      },
      {
        $set: { sentTime: time, status: status },
      },
      { upsert: true }
    );
  }
}

module.exports = SmsRepo;
