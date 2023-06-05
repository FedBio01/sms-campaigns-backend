const db = require("../services/DataBase");
const campaignCollection = "campaign";

class CampaignRepo {
  /*
    get
  */
  static async getCampign() {
    /*
    return await db.getDocument()
    */
    return null;
  }

  static async getCampaignByName(name) {
    return await db.getDocument(
      {
        _id: name,
      },
      campaignCollection
    );
  }
  /*
    insert
  */
  static async insertCampagna(campaign) {
    return await db.insertDocument(campaign, campaignCollection);
  }
}

module.exports = CampagnaRepo;
