const Innings = require("../models/Innings.model");
const Ball = require("../models/Ball.model");
const ApiError = require("../utils/apiError");

class InningsService {
  async getInningsById(inningsId) {
    const innings = await Innings.findById(inningsId)
      .populate("battingTeam")
      .populate("bowlingTeam")
      .populate("batters.player")
      .populate("bowlers.player");

    if (!innings) throw new ApiError(404, "Innings not found");
    return innings;
  }

  async getInningsBalls(inningsId, page = 1, limit = 30) {
    const innings = await Innings.findById(inningsId);
    if (!innings) throw new ApiError(404, "Innings not found");

    const skip = (page - 1) * limit;
    const total = await Ball.countDocuments({ innings: inningsId });

    const balls = await Ball.find({ innings: inningsId })
      .sort({ overNumber: 1, ballNumber: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    return {
      balls,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    };
  }

  async getOverSummary(inningsId) {
    const balls = await Ball.find({
      innings: inningsId,
      isValidBall: true,
    }).sort({ overNumber: 1, ballNumber: 1 });

    const overMap = {};
    balls.forEach((ball) => {
      if (!overMap[ball.overNumber]) {
        overMap[ball.overNumber] = {
          over: ball.overNumber,
          balls: [],
          runs: 0,
          wickets: 0,
        };
      }
      overMap[ball.overNumber].balls.push(ball);
      overMap[ball.overNumber].runs += ball.totalRuns;
      if (ball.isWicket) overMap[ball.overNumber].wickets += 1;
    });

    return Object.values(overMap);
  }

  async getScorecard(inningsId) {
    const innings = await Innings.findById(inningsId)
      .populate("battingTeam")
      .populate("bowlingTeam")
      .populate("batters.player")
      .populate("bowlers.player");

    if (!innings) throw new ApiError(404, "Innings not found");

    const battingCard = innings.batters
      .filter((b) => b.status !== "yet_to_bat")
      .map((b) => ({
        playerName: b.playerName,
        runs: b.runs,
        balls: b.balls,
        fours: b.fours,
        sixes: b.sixes,
        strikeRate:
          b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(2) : "0.00",
        status: b.status,
        dismissalInfo: b.dismissalInfo,
      }));

    const yetToBat = innings.batters.filter((b) => b.status === "yet_to_bat");

    const bowlingCard = innings.bowlers.map((b) => {
      const totalBalls = b.overs * 6 + b.balls;
      return {
        playerName: b.playerName,
        overs: `${b.overs}.${b.balls}`,
        maidens: b.maidens,
        runs: b.runs,
        wickets: b.wickets,
        economy:
          totalBalls > 0 ? ((b.runs / totalBalls) * 6).toFixed(2) : "0.00",
        wides: b.wides,
        noBalls: b.noBalls,
      };
    });

    return {
      innings: {
        number: innings.inningsNumber,
        battingTeam: innings.battingTeamName,
        bowlingTeam: innings.bowlingTeamName,
        totalRuns: innings.totalRuns,
        wickets: innings.wickets,
        overs: `${innings.oversCompleted}.${innings.ballsInCurrentOver}`,
        extras: innings.extras,
        target: innings.target,
        status: innings.status,
      },
      battingCard,
      yetToBat: yetToBat.map((b) => b.playerName),
      bowlingCard,
    };
  }
}

module.exports = new InningsService();