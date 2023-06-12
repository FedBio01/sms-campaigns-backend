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

  //get multiple
  static async getAllCampaign() {
    return await db.getMultipleDocuments(campaignCollection);
  }
  /**
   *
   * @param {*} creatorName
   * @returns
   */
  static async getMultipleCampaignNotActiveByCreator(creator) {
    return await db.getMultipleDocuments(campaignCollection, {
      creator: creator,
      isStarted: false,
    });
  }

  //insert
  /**
   * insert campaign in the database
   * @param {Array} campaign - campaign object
   * @returns object with aknowledget status and inserted ids of the campaigns
   */
  static async insertCampaign(campaign) {
    return await db.insertSingleDocument(campaignCollection, campaign);
  }

  static async updateCampaignStartTime(campaign, time) {
    await db.modifySingleDocument(
      campaignCollection,
      campaign,
      {
        $set: { start: time, isStarted: true },
      },
      null
    );
  }

  static async updateCampaignEndTime(campaign, time) {
    await db.modifySingleDocument(
      campaignCollection,
      campaign,
      {
        $set: { finish: time },
      },
      null
    );
  }
}

module.exports = CampaignRepo;
