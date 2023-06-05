const db = require("../services/DataBase");
const smsCollection = "sms";
class SmsRepo {
  static async getSms() {
    /*
    return await db.getDocument()
    */
    return null;
  }
  static async insertSms() {
    /*
    await db.insertDocument()
    */
    return null;
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
