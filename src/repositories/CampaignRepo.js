const db = require("../services/DataBase");
const campaignCollection = "campaign";

class CampaignRepo {
  //get single
  /**
   * get the Campaign given
   * @param campaign - campaign da cercare nel db
   * @returns the searched campaign
   */
  static async getCampaign(campaign) {
    return db.getSingleDocument(campaignCollection, campaign);
  }

  /**
   * get the campaign form the database using the name
   * @param name - name of the campaign
   * @returns the campaign searched or null
   */
  static async getCampaignByName(name) {
    return await db.getSingleDocument(campaignCollection, {
      name: name,
    });
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
  static async getMultipleCampaignByCreator(creator) {
    return await db.getMultipleDocuments(campaignCollection, {
      creator: creator,
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
}

module.exports = CampaignRepo;
