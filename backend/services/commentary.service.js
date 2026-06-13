const Commentary = require("../models/Commentary.model");
const ApiError = require("../utils/apiError");

class CommentaryService {
  async getMatchCommentary(matchId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const total = await Commentary.countDocuments({ match: matchId });

    const commentary = await Commentary.find({ match: matchId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return {
      commentary,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    };
  }

  async getInningsCommentary(inningsId) {
    return await Commentary.find({ innings: inningsId })
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async addCommentary(matchId, inningsId, text, type = "general") {
    const commentary = await Commentary.create({
      match: matchId,
      innings: inningsId,
      text,
      type,
      isImportant: false,
    });
    return commentary;
  }
}

module.exports = new CommentaryService();