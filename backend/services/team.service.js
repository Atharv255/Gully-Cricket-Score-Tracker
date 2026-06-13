const Team = require("../models/Team.model");
const Player = require("../models/Player.model");
const ApiError = require("../utils/apiError");

class TeamService {
  async createTeam(teamData, userId) {
    const { name, captain, shortName, players } = teamData;

    // Create player documents
    const createdPlayers = [];
    if (players && players.length > 0) {
      for (const playerName of players) {
        const player = await Player.create({ name: playerName });
        createdPlayers.push({
          player: player._id,
          isCaptain: playerName === captain,
        });
      }
    }

    const team = await Team.create({
      name,
      captain,
      shortName: shortName || name.substring(0, 3).toUpperCase(),
      players: createdPlayers,
      createdBy: userId,
    });

    return await team.populate("players.player");
  }

  async getAllTeams(query = {}) {
    const { page = 1, limit = 10, search } = query;
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { captain: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Team.countDocuments(filter);
    const teams = await Team.find(filter)
      .populate("players.player")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return {
      teams,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    };
  }

  async getTeamById(teamId) {
    const team = await Team.findById(teamId).populate("players.player");
    if (!team) {
      throw new ApiError(404, "Team not found");
    }
    return team;
  }

  async updateTeam(teamId, updateData) {
    const team = await Team.findByIdAndUpdate(teamId, updateData, {
      new: true,
      runValidators: true,
    }).populate("players.player");

    if (!team) {
      throw new ApiError(404, "Team not found");
    }
    return team;
  }

  async deleteTeam(teamId) {
    const team = await Team.findByIdAndUpdate(
      teamId,
      { isActive: false },
      { new: true }
    );
    if (!team) {
      throw new ApiError(404, "Team not found");
    }
    return { message: "Team deleted successfully" };
  }

  async addPlayerToTeam(teamId, playerData) {
    const team = await Team.findById(teamId);
    if (!team) {
      throw new ApiError(404, "Team not found");
    }

    if (team.players.length >= 11) {
      throw new ApiError(400, "Team already has 11 players");
    }

    const player = await Player.create({ name: playerData.name });
    team.players.push({
      player: player._id,
      isCaptain: playerData.isCaptain || false,
    });

    await team.save();
    return await team.populate("players.player");
  }
}

module.exports = new TeamService();