const Player = require("../models/Player.model");
const ApiError = require("../utils/apiError");

class PlayerService {
  async createPlayer(playerData) {
    const player = await Player.create(playerData);
    return player;
  }

  async getAllPlayers(query = {}) {
    const { page = 1, limit = 20, search } = query;
    const filter = { isActive: true };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const total = await Player.countDocuments(filter);
    const players = await Player.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    return {
      players,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    };
  }

  async getPlayerById(playerId) {
    const player = await Player.findById(playerId);
    if (!player) {
      throw new ApiError(404, "Player not found");
    }
    return player;
  }

  async updatePlayer(playerId, updateData) {
    const player = await Player.findByIdAndUpdate(playerId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!player) {
      throw new ApiError(404, "Player not found");
    }
    return player;
  }

  async deletePlayer(playerId) {
    const player = await Player.findByIdAndUpdate(
      playerId,
      { isActive: false },
      { new: true }
    );
    if (!player) {
      throw new ApiError(404, "Player not found");
    }
    return { message: "Player deleted successfully" };
  }
}

module.exports = new PlayerService();