const matchService = require("../services/match.service");
const socketService = require("../services/socket.service");
const ApiResponse = require("../utils/apiResponse");

class MatchController {
  async createMatch(req, res, next) {
    try {
      const match = await matchService.createMatch(req.body, req.user._id);
      return ApiResponse.created(res, { match }, "Match created successfully");
    } catch (error) {
      next(error);
    }
  }

  async startMatch(req, res, next) {
    try {
      const { matchId } = req.params;
      const { openingBatsmen, openingBowler } = req.body;

      const match = await matchService.startMatch(
        matchId,
        openingBatsmen,
        openingBowler
      );

      socketService.emitMatchStarted(matchId, { match });

      return ApiResponse.success(res, { match }, "Match started successfully");
    } catch (error) {
      next(error);
    }
  }

  async getAllMatches(req, res, next) {
    try {
      const result = await matchService.getAllMatches(req.query);
      return ApiResponse.paginated(
        res,
        result.matches,
        result.pagination,
        "Matches fetched successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getMatchById(req, res, next) {
    try {
      const match = await matchService.getMatchById(req.params.matchId);
      return ApiResponse.success(
        res,
        { match },
        "Match fetched successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getCurrentInnings(req, res, next) {
    try {
      const innings = await matchService.getCurrentInnings(
        req.params.matchId
      );
      return ApiResponse.success(
        res,
        { innings },
        "Current innings fetched"
      );
    } catch (error) {
      next(error);
    }
  }

  async updateMatch(req, res, next) {
    try {
      const match = await matchService.updateMatch(
        req.params.matchId,
        req.body
      );

      socketService.emitToMatch(req.params.matchId, "match_updated", {
        match,
      });

      return ApiResponse.success(
        res,
        { match },
        "Match updated successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteMatch(req, res, next) {
    try {
      const result = await matchService.deleteMatch(req.params.matchId);
      return ApiResponse.success(res, result, "Match deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  async getMatchByShareToken(req, res, next) {
    try {
      const match = await matchService.getMatchByShareToken(
        req.params.token
      );
      return ApiResponse.success(
        res,
        { match },
        "Match fetched successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MatchController();