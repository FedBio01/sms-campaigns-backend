const db = require("../services/DataBase");

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
}

module.exports = SmsRepo;
