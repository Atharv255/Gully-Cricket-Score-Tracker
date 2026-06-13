const Match = require("../models/Match.model");
const Team = require("../models/Team.model");
const Player = require("../models/Player.model");
const Innings = require("../models/Innings.model");
const ApiError = require("../utils/apiError");
const { MATCH_STATUS, TOSS_DECISIONS } = require("../config/constants");

class MatchService {
  async createMatch(matchData, userId) {
    const { title, groundName, matchDate, totalOvers, teamA, teamB, toss } =
      matchData;

    // Create players for Team A
const teamAPlayerDocs = [];
for (const playerName of teamA.players) {
  const player = await Player.create({ name: playerName.trim() });
  teamAPlayerDocs.push({
    player: player._id,
    isCaptain: playerName.trim() === teamA.captain.trim(),
  });
}

    // Create players for Team B
    const teamBPlayerDocs = [];
    for (const playerName of teamB.players) {
      const player = await Player.create({ name: playerName.trim() });
      teamBPlayerDocs.push({
        player: player._id,
        isCaptain: playerName.trim() === teamB.captain.trim(),
      });
    }

    // Create Team A
    const newTeamA = await Team.create({
      name: teamA.name,
      captain: teamA.captain,
      shortName: teamA.name.substring(0, 3).toUpperCase(),
      players: teamAPlayerDocs,
      createdBy: userId,
    });

    // Create Team B
    const newTeamB = await Team.create({
      name: teamB.name,
      captain: teamB.captain,
      shortName: teamB.name.substring(0, 3).toUpperCase(),
      players: teamBPlayerDocs,
      createdBy: userId,
    });

    // Determine batting/bowling first based on toss
    let battingFirstTeam, bowlingFirstTeam;
    const tossWinnerIsTeamA =
      toss.winner.toLowerCase() === teamA.name.toLowerCase();

    if (tossWinnerIsTeamA) {
      if (toss.decision === TOSS_DECISIONS.BAT) {
        battingFirstTeam = newTeamA._id;
        bowlingFirstTeam = newTeamB._id;
      } else {
        battingFirstTeam = newTeamB._id;
        bowlingFirstTeam = newTeamA._id;
      }
    } else {
      if (toss.decision === TOSS_DECISIONS.BAT) {
        battingFirstTeam = newTeamB._id;
        bowlingFirstTeam = newTeamA._id;
      } else {
        battingFirstTeam = newTeamA._id;
        bowlingFirstTeam = newTeamB._id;
      }
    }

    // Create Match
    const match = await Match.create({
      title,
      groundName,
      matchDate,
      totalOvers,
      teamA: { team: newTeamA._id, name: newTeamA.name },
      teamB: { team: newTeamB._id, name: newTeamB.name },
      toss: {
        winner: toss.winner,
        winnerTeamId: tossWinnerIsTeamA ? newTeamA._id : newTeamB._id,
        decision: toss.decision,
      },
      battingFirst: battingFirstTeam,
      bowlingFirst: bowlingFirstTeam,
      status: MATCH_STATUS.UPCOMING,
      createdBy: userId,
    });

    return await this.getMatchById(match._id);
  }

  async startMatch(matchId, openingBatsmen, openingBowler) {
    const match = await Match.findById(matchId)
      .populate({
        path: "teamA.team",
        populate: { path: "players.player" },
      })
      .populate({
        path: "teamB.team",
        populate: { path: "players.player" },
      });

    if (!match) throw new ApiError(404, "Match not found");
    if (match.status === MATCH_STATUS.LIVE) {
      throw new ApiError(400, "Match already started");
    }
    if (match.status === MATCH_STATUS.COMPLETED) {
      throw new ApiError(400, "Match already completed");
    }

    // Get batting team players with full population
    const battingTeam = await Team.findById(match.battingFirst).populate(
      "players.player"
    );
    const bowlingTeam = await Team.findById(match.bowlingFirst).populate(
      "players.player"
    );

    // Create batting stats for all players
    const batterStats = battingTeam.players.map((p, index) => ({
      player: p.player._id,
      playerName: p.player.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      status: "yet_to_bat",
      battingOrder: index + 1,
      isStriker: false,
    }));

    // Set openers
    const striker = batterStats.find(
      (b) => b.player.toString() === openingBatsmen.striker
    );
    const nonStriker = batterStats.find(
      (b) => b.player.toString() === openingBatsmen.nonStriker
    );

    if (!striker || !nonStriker) {
      throw new ApiError(400, "Invalid opener selections");
    }

    striker.status = "batting";
    striker.isStriker = true;
    nonStriker.status = "batting";
    nonStriker.isStriker = false;

    // Create bowling stats for opening bowler
    const openingBowlerPlayer = bowlingTeam.players.find(
      (p) => p.player._id.toString() === openingBowler.playerId
    );

    if (!openingBowlerPlayer) {
      throw new ApiError(400, "Invalid bowler selection");
    }

    const bowlerStats = [
      {
        player: openingBowlerPlayer.player._id,
        playerName: openingBowlerPlayer.player.name,
        overs: 0,
        balls: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
        wides: 0,
        noBalls: 0,
        isCurrentBowler: true,
      },
    ];

    // Create first innings
    const innings = await Innings.create({
      match: matchId,
      inningsNumber: 1,
      battingTeam: battingTeam._id,
      battingTeamName: battingTeam.name,
      bowlingTeam: bowlingTeam._id,
      bowlingTeamName: bowlingTeam.name,
      totalOvers: match.totalOvers,
      batters: batterStats,
      bowlers: bowlerStats,
      currentStriker: openingBatsmen.striker,
      currentNonStriker: openingBatsmen.nonStriker,
      currentBowler: openingBowler.playerId,
      partnership: {
        runs: 0,
        balls: 0,
        batter1: openingBatsmen.striker,
        batter2: openingBatsmen.nonStriker,
      },
    });

    // Update match
    match.status = MATCH_STATUS.LIVE;
    match.innings.push(innings._id);
    match.currentInnings = 1;
    await match.save();

    return await this.getMatchById(matchId);
  }

  async getAllMatches(query = {}) {
    const { status, page = 1, limit = 10 } = query;
    const filter = { isActive: true };

    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const total = await Match.countDocuments(filter);

    const matches = await Match.find(filter)
      .populate("teamA.team", "name shortName")
      .populate("teamB.team", "name shortName")
      .populate({
        path: "innings",
        select:
          "totalRuns wickets oversCompleted ballsInCurrentOver inningsNumber battingTeamName",
      })
      .sort({ createdAt: -1 })
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

  async getMatchById(matchId) {
    const match = await Match.findById(matchId)
      .populate({
        path: "teamA.team",
        populate: {
          path: "players.player",
          model: "Player",
        },
      })
      .populate({
        path: "teamB.team",
        populate: {
          path: "players.player",
          model: "Player",
        },
      })
      .populate("battingFirst", "name shortName")
      .populate("bowlingFirst", "name shortName")
      .populate({
        path: "innings",
        populate: [
          { path: "battingTeam", select: "name shortName" },
          { path: "bowlingTeam", select: "name shortName" },
          { path: "batters.player", model: "Player" },
          { path: "bowlers.player", model: "Player" },
        ],
      });

    if (!match) throw new ApiError(404, "Match not found");
    return match;
  }

  async getMatchWithInnings(matchId) {
    return await this.getMatchById(matchId);
  }

  async getCurrentInnings(matchId) {
    const match = await Match.findById(matchId);
    if (!match) throw new ApiError(404, "Match not found");

    if (match.innings.length === 0) {
      throw new ApiError(400, "Match has not started yet");
    }

    const currentInningsId = match.innings[match.innings.length - 1];
    const innings = await Innings.findById(currentInningsId)
      .populate("batters.player")
      .populate("bowlers.player")
      .populate("battingTeam")
      .populate("bowlingTeam");

    if (!innings) throw new ApiError(404, "Innings not found");
    return innings;
  }

  async updateMatch(matchId, updateData) {
    const match = await Match.findByIdAndUpdate(matchId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!match) throw new ApiError(404, "Match not found");
    return match;
  }

  async deleteMatch(matchId) {
    const match = await Match.findByIdAndUpdate(
      matchId,
      { isActive: false },
      { new: true }
    );
    if (!match) throw new ApiError(404, "Match not found");
    return { message: "Match deleted successfully" };
  }

  async getMatchByShareToken(token) {
    const match = await Match.findOne({ shareToken: token, isActive: true })
      .populate({
        path: "teamA.team",
        populate: { path: "players.player" },
      })
      .populate({
        path: "teamB.team",
        populate: { path: "players.player" },
      })
      .populate({
        path: "innings",
        populate: [
          { path: "batters.player" },
          { path: "bowlers.player" },
          { path: "battingTeam" },
          { path: "bowlingTeam" },
        ],
      });

    if (!match) throw new ApiError(404, "Match not found");
    return match;
  }
}

module.exports = new MatchService();