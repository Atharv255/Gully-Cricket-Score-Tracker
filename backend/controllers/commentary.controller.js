const commentaryService = require("../services/commentary.service");
const ApiResponse = require("../utils/apiResponse");

class CommentaryController {
  async getMatchCommentary(req, res, next) {
    try {
      const { matchId } = req.params;
      const { page, limit } = req.query;
      const result = await commentaryService.getMatchCommentary(
        matchId,
        page,
        limit
      );
      return ApiResponse.paginated(
        res,
        result.commentary,
        result.pagination,
        "Commentary fetched successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getInningsCommentary(req, res, next) {
    try {
      const commentary = await commentaryService.getInningsCommentary(
        req.params.inningsId
      );
      return ApiResponse.success(
        res,
        { commentary },
        "Innings commentary fetched"
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommentaryController();