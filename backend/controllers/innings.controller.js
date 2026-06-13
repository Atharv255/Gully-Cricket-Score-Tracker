const inningsService = require("../services/innings.service");
const ApiResponse = require("../utils/apiResponse");

class InningsController {
  async getInningsById(req, res, next) {
    try {
      const innings = await inningsService.getInningsById(
        req.params.inningsId
      );
      return ApiResponse.success(
        res,
        { innings },
        "Innings fetched successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getInningsBalls(req, res, next) {
    try {
      const { inningsId } = req.params;
      const { page, limit } = req.query;
      const result = await inningsService.getInningsBalls(
        inningsId,
        page,
        limit
      );
      return ApiResponse.paginated(
        res,
        result.balls,
        result.pagination,
        "Balls fetched successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getOverSummary(req, res, next) {
    try {
      const overSummary = await inningsService.getOverSummary(
        req.params.inningsId
      );
      return ApiResponse.success(
        res,
        { overSummary },
        "Over summary fetched successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getScorecard(req, res, next) {
    try {
      const scorecard = await inningsService.getScorecard(
        req.params.inningsId
      );
      return ApiResponse.success(
        res,
        { scorecard },
        "Scorecard fetched successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InningsController();