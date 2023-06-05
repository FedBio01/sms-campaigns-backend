const db = require("../services/DataBase");
const smsCollection = "sms";
class SmsRepo {
  static async getSms(sms) {
    return await db.getDocument(
      {
        destinationNumber: sms.destinationNumber,
        message: sms.message,
        status: sms.status,
      },
      "sms"
    );
  }

  static async insertSms(sms) {
    try {
      await db.insertDocument(
        {
          destinationNumber: sms.destinationNumber,
          message: sms.message,
          status: sms.status,
        },
        "sms"
      );
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
