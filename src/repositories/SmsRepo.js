const db = require("../services/DataBase");
const smsCollection = "sms";

class SmsRepo {
  //get
  static async getSingleSms(sms) {
    return await db.getSingleDocument(smsCollection, sms);
  }
  /**
   * query the db for the existence of the sms
   * @param {array} sms - array of sms to get from the database
   * @returns an array contenent the sms
   */
  static async getSms(sms) {
    return await db.getSingleDocument(smsCollection, sms);
  }

  /**
   * get sms from the id
   * @param {array} smsIds - array of sms ids
   * @returns array of sms object
   */
  static async getSmsById(smsId) {
    return await db.getSingleDocument(smsCollection, {
      _id: {
        $in: smsId,
      },
    });
  }
  /**
   *
   * @param {*} smsArrayId
   * @returns
   */
  static async getMultipleSmsById(smsArrayId) {
    return await db.getMultipleDocuments(smsCollection, {
      _id: {
        $in: smsArrayId,
      },
    });
  }
  //insert
  /**
   * insert the sms given in the database
   * @param {array} sms - vector of sms to insert in the database
   * @returns object with aknowledget status and inserted ids of the sms
   */
  static async insertSms(sms) {
    try {
      return await db.insertSingleDocument(smsCollection, sms);
    } catch (error) {
      console.error(error);
    }
  }
  /**
   *
   * @param {*} sms
   * @returns
   */
  static async insertMultipleSms(sms) {
    try {
      return await db.insertMultipleDocuments(smsCollection, sms);
    } catch (error) {
      console.error(error);
    }
  }
  //update
  /**
   * update the sms status field
   * @param {array} sms - sms to update
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
   * update the sms status field
   * @param {Array} sms - sms to update
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
   * @param {array} sms - sms to update
   * @param status - status
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
