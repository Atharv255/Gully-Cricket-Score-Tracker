const playerService = require("../services/player.service");
const ApiResponse = require("../utils/apiResponse");

class PlayerController {
  async createPlayer(req, res, next) {
    try {
      const player = await playerService.createPlayer(req.body);
      return ApiResponse.created(
        res,
        { player },
        "Player created successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllPlayers(req, res, next) {
    try {
      const result = await playerService.getAllPlayers(req.query);
      return ApiResponse.paginated(
        res,
        result.players,
        result.pagination,
        "Players fetched successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getPlayerById(req, res, next) {
    try {
      const player = await playerService.getPlayerById(req.params.playerId);
      return ApiResponse.success(
        res,
        { player },
        "Player fetched successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async updatePlayer(req, res, next) {
    try {
      const player = await playerService.updatePlayer(
        req.params.playerId,
        req.body
      );
      return ApiResponse.success(
        res,
        { player },
        "Player updated successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async deletePlayer(req, res, next) {
    try {
      const result = await playerService.deletePlayer(req.params.playerId);
      return ApiResponse.success(res, result, "Player deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PlayerController();