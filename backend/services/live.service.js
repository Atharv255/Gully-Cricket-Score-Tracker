const Match = require("../models/Match.model");
const Innings = require("../models/Innings.model");
const Commentary = require("../models/Commentary.model");
const ApiError = require("../utils/apiError");
const {
  calculateRunRate,
  calculateRequiredRunRate,
} = require("../utils/cricketHelpers");

class LiveService {
  async getLiveMatches() {
    const matches = await Match.find({ status: "live", isActive: true })
      .populate("teamA.team", "name shortName")
      .populate("teamB.team", "name shortName")
      .populate({
        path: "innings",
        select:
          "totalRuns wickets oversCompleted ballsInCurrentOver inningsNumber battingTeamName status",
      })
      .sort({ updatedAt: -1 });

    return matches;
  }

  async getLiveScore(matchId) {
    const match = await Match.findById(matchId)
      .populate("teamA.team", "name shortName players")
      .populate("teamB.team", "name shortName players")
      .populate({
        path: "innings",
        populate: [
          { path: "batters.player", select: "name" },
          { path: "bowlers.player", select: "name" },
        ],
      });

    if (!match) throw new ApiError(404, "Match not found");

    const currentInnings =
      match.innings[match.innings.length - 1];

    if (!currentInnings) {
      return {
        match: {
          _id: match._id,
          title: match.title,
          status: match.status,
          teamA: match.teamA,
          teamB: match.teamB,
          toss: match.toss,
        },
        currentInnings: null,
      };
    }

    const currentInningsData = await Innings.findById(currentInnings._id || currentInnings)
      .populate("batters.player")
      .populate("bowlers.player");

   // Find current striker (must be batting AND isStriker)
const striker = currentInningsData.batters.find(
  (b) => b.isStriker === true && b.status === "batting"
);

// Find current non-striker (batting but not striker)
const nonStriker = currentInningsData.batters.find(
  (b) =>
    b.isStriker === false &&
    b.status === "batting" &&
    b.player?.toString() !== striker?.player?.toString()
);
    const currentBowler = currentInningsData.bowlers.find(
      (b) => b.isCurrentBowler
    );

    const runRate = calculateRunRate(
      currentInningsData.totalRuns,
      currentInningsData.oversCompleted,
      currentInningsData.ballsInCurrentOver
    );

    let requiredRunRate = null;
    let requiredRuns = null;
    if (currentInningsData.target) {
      requiredRuns =
        currentInningsData.target - currentInningsData.totalRuns;
      requiredRunRate = calculateRequiredRunRate(
        currentInningsData.target,
        currentInningsData.totalRuns,
        currentInningsData.totalOvers,
        currentInningsData.oversCompleted,
        currentInningsData.ballsInCurrentOver
      );
    }

    // Get last 6 balls for current over display
    const recentBalls = currentInningsData.recentBalls.slice(-12);

    return {
      match: {
        _id: match._id,
        title: match.title,
        status: match.status,
        teamA: match.teamA,
        teamB: match.teamB,
        toss: match.toss,
        result: match.result,
        shareToken: match.shareToken,
      },
      currentInnings: {
        _id: currentInningsData._id,
        inningsNumber: currentInningsData.inningsNumber,
        battingTeam: currentInningsData.battingTeamName,
        bowlingTeam: currentInningsData.bowlingTeamName,
        totalRuns: currentInningsData.totalRuns,
        wickets: currentInningsData.wickets,
        overs: `${currentInningsData.oversCompleted}.${currentInningsData.ballsInCurrentOver}`,
        runRate,
        target: currentInningsData.target,
        requiredRuns,
        requiredRunRate,
        extras: currentInningsData.extras,
        striker: striker
          ? {
              playerId: striker.player,
              playerName: striker.playerName,
              runs: striker.runs,
              balls: striker.balls,
              fours: striker.fours,
              sixes: striker.sixes,
              strikeRate:
                striker.balls > 0
                  ? ((striker.runs / striker.balls) * 100).toFixed(2)
                  : "0.00",
            }
          : null,
        nonStriker: nonStriker
          ? {
              playerId: nonStriker.player,
              playerName: nonStriker.playerName,
              runs: nonStriker.runs,
              balls: nonStriker.balls,
              fours: nonStriker.fours,
              sixes: nonStriker.sixes,
              strikeRate:
                nonStriker.balls > 0
                  ? ((nonStriker.runs / nonStriker.balls) * 100).toFixed(2)
                  : "0.00",
            }
          : null,
        currentBowler: currentBowler
          ? {
              playerId: currentBowler.player,
              playerName: currentBowler.playerName,
              overs: `${currentBowler.overs}.${currentBowler.balls}`,
              maidens: currentBowler.maidens,
              runs: currentBowler.runs,
              wickets: currentBowler.wickets,
              economy:
                currentBowler.overs * 6 + currentBowler.balls > 0
                  ? (
                      (currentBowler.runs /
                        (currentBowler.overs * 6 + currentBowler.balls)) *
                      6
                    ).toFixed(2)
                  : "0.00",
            }
          : null,
        partnership: currentInningsData.partnership,
        lastWicket: currentInningsData.lastWicket,
        recentBalls,
        status: currentInningsData.status,
      },
      previousInnings:
        match.innings.length > 1
          ? await this.getInningsSummary(match.innings[0]._id || match.innings[0])
          : null,
    };
  }

  async getInningsSummary(inningsId) {
    const innings = await Innings.findById(inningsId);
    if (!innings) return null;

    return {
      inningsNumber: innings.inningsNumber,
      battingTeam: innings.battingTeamName,
      totalRuns: innings.totalRuns,
      wickets: innings.wickets,
      overs: `${innings.oversCompleted}.${innings.ballsInCurrentOver}`,
    };
  }

  async getUpcomingMatches() {
    return await Match.find({ status: "upcoming", isActive: true })
      .populate("teamA.team", "name shortName")
      .populate("teamB.team", "name shortName")
      .sort({ matchDate: 1 })
      .limit(10);
  }

  async getCompletedMatches(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const total = await Match.countDocuments({
      status: "completed",
      isActive: true,
    });

    const matches = await Match.find({ status: "completed", isActive: true })
      .populate("teamA.team", "name shortName")
      .populate("teamB.team", "name shortName")
      .populate({
        path: "innings",
        select: "totalRuns wickets oversCompleted inningsNumber battingTeamName",
      })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return {
      matches,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    };
  }
}

module.exports = new LiveService();