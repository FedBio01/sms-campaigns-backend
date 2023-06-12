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

  //aggregate
  static async getAllCampaignStatisticsByUser(creator) {
    return await db.aggregate(
      campaignCollection,
      [
        {
          $match: {
            creator: creator,
          },
        },
        {
          $lookup: {
            from: "sms",
            localField: "smss",
            foreignField: "_id",
            as: "sms_details",
          },
        },
        {
          $unwind: "$sms_details",
        },
        {
          $group: {
            _id: "$_id",
            totalSent: {
              $sum: {
                $cond: [{ $eq: ["$sms_details.status", "sent"] }, 1, 0],
              },
            },
            totalReject: {
              $sum: {
                $cond: [{ $eq: ["$sms_details.status", "reject"] }, 1, 0],
              },
            },
            campaign: { $first: "$$ROOT" },
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$campaign",
                { totalSent: "$totalSent", totalReject: "$totalReject" },
              ],
            },
          },
        },
        {
          $project: {
            smss: 0,
            sms_details: 0,
          },
        },
      ],
      null
    );
  }
}

module.exports = CampaignRepo;
