const scoringService = require("../services/scoring.service");
const liveService = require("../services/live.service");
const socketService = require("../services/socket.service");
const ApiResponse = require("../utils/apiResponse");

class ScoringController {
  async recordBall(req, res, next) {
    try {
      const { matchId } = req.params;
      const result = await scoringService.recordBall(matchId, req.body);

      // Get full live score
      const liveScore = await liveService.getLiveScore(matchId);

      // Emit events via Socket.IO
      socketService.emitBallRecorded(matchId, {
        ball: result.ball,
        innings: result.innings,
        liveScore,
      });

      socketService.emitScoreUpdate(matchId, { liveScore });

      if (result.isWicket) {
        socketService.emitWicket(matchId, {
          innings: result.innings,
          liveScore,
        });
      }

      if (result.isOverComplete) {
        socketService.emitOverComplete(matchId, {
          innings: result.innings,
          liveScore,
        });
      }

      if (result.inningsComplete) {
        socketService.emitInningsEnd(matchId, {
          innings: result.innings,
          liveScore,
        });
      }

      return ApiResponse.success(
        res,
        {
          ball: result.ball,
          innings: result.innings,
          isOverComplete: result.isOverComplete,
          isWicket: result.isWicket,
          inningsComplete: result.inningsComplete,
          requireNewBatsman: result.requireNewBatsman,
          requireNewBowler: result.requireNewBowler,
          liveScore,
        },
        "Ball recorded successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async selectNewBatsman(req, res, next) {
    try {
      const { matchId } = req.params;
      const innings = await scoringService.selectNewBatsman(
        matchId,
        req.body
      );

      // Get fresh live score with updated batsman info
      const liveScore = await liveService.getLiveScore(matchId);

      // Emit BOTH events to update all clients immediately
      socketService.emitBatsmanChanged(matchId, { innings, liveScore });
      socketService.emitScoreUpdate(matchId, { liveScore });

      return ApiResponse.success(
        res,
        { innings, liveScore },
        "Batsman selected successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async selectNewBowler(req, res, next) {
    try {
      const { matchId } = req.params;
      const innings = await scoringService.selectNewBowler(
        matchId,
        req.body
      );

      // Get fresh live score with updated bowler info
      const liveScore = await liveService.getLiveScore(matchId);

      // Emit BOTH events to update all clients immediately
      socketService.emitBowlerChanged(matchId, { innings, liveScore });
      socketService.emitScoreUpdate(matchId, { liveScore });

      return ApiResponse.success(
        res,
        { innings, liveScore },
        "Bowler selected successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async undoLastBall(req, res, next) {
    try {
      const { matchId } = req.params;
      const innings = await scoringService.undoLastBall(matchId);

      const liveScore = await liveService.getLiveScore(matchId);
      socketService.emitBallUndone(matchId, { innings, liveScore });
      socketService.emitScoreUpdate(matchId, { liveScore });

      return ApiResponse.success(
        res,
        { innings, liveScore },
        "Last ball undone successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async endInnings(req, res, next) {
    try {
      const { matchId } = req.params;
      const innings = await scoringService.endInnings(matchId);

      const liveScore = await liveService.getLiveScore(matchId);
      socketService.emitInningsEnd(matchId, { innings, liveScore });

      return ApiResponse.success(
        res,
        { innings, liveScore },
        "Innings ended successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async startSecondInnings(req, res, next) {
    try {
      const { matchId } = req.params;
      const { openingBatsmen, openingBowler } = req.body;

      const innings = await scoringService.startSecondInnings(
        matchId,
        openingBatsmen,
        openingBowler
      );

      const liveScore = await liveService.getLiveScore(matchId);
      socketService.emitMatchStarted(matchId, {
        message: "Second innings started",
        liveScore,
      });

      return ApiResponse.success(
        res,
        { innings, liveScore },
        "Second innings started successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async endMatch(req, res, next) {
    try {
      const { matchId } = req.params;
      const match = await scoringService.endMatch(matchId, req.body);

      socketService.emitMatchEnd(matchId, { match });

      return ApiResponse.success(
        res,
        { match },
        "Match ended successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ScoringController();