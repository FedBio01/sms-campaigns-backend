const db = require("../services/DataBase");
const smsCollection = "sms";
class SmsRepo {
  static async getSms(sms) {
    return await db.getDocument(sms, "sms");
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
}

module.exports = SmsRepo;
