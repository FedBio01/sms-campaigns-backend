const db = require("../services/DataBase");
const smsCollection = "sms";
class SmsRepo {
  static async getSms(sms) {
    return await db.getDocument(sms, "sms");
  }

  static async getSmsById(smsIds) {
    return await db.getDocument(
      {
        _id: {
          $in: smsIds,
        },
      },
      "sms"
    );
  }

  static async insertSms(sms) {
    try {
      return await db.insertDocument(sms, "sms");
    } catch (error) {
      console.error(error);
    }
  }

  static async updateSmsStatus(sms, valore) {
    await db.modifyDocument(
      smsCollection,
      sms,
      {
        $set: { status: valore },
      },
      null
    );
  }

  static async updateSmsStatusByCampaign(sms, valore) {
    const campaign = sms.campaign;
    await db.modifyDocument(
      smsCollection,
      {
        campaign: campaign,
      },
      {
        $set: { status: valore },
      },
      null
    );
  }

  static async updateSmsStatusAndSentTime(sms, valore, time) {
    await db.modifyDocument(
      smsCollection,
      sms,
      {
        $set: { sentTime: time, status: valore },
      },
      { upsert: true }
    );
  }
}

module.exports = SmsRepo;
