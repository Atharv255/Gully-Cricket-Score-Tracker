const liveService = require("../services/live.service");
const ApiResponse = require("../utils/apiResponse");

class LiveController {
  async getLiveMatches(req, res, next) {
    try {
      const matches = await liveService.getLiveMatches();
      return ApiResponse.success(
        res,
        { matches },
        "Live matches fetched successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getLiveScore(req, res, next) {
    try {
      const { matchId } = req.params;
      const liveScore = await liveService.getLiveScore(matchId);
      return ApiResponse.success(
        res,
        { liveScore },
        "Live score fetched successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingMatches(req, res, next) {
    try {
      const matches = await liveService.getUpcomingMatches();
      return ApiResponse.success(
        res,
        { matches },
        "Upcoming matches fetched"
      );
    } catch (error) {
      next(error);
    }
  }

  async getCompletedMatches(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await liveService.getCompletedMatches(page, limit);
      return ApiResponse.paginated(
        res,
        result.matches,
        result.pagination,
        "Completed matches fetched"
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LiveController();