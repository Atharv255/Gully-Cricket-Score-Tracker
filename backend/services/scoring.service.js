const Innings = require("../models/Innings.model");
const Ball = require("../models/Ball.model");
const Match = require("../models/Match.model");
const Team = require("../models/Team.model");
const Player = require("../models/Player.model");
const Commentary = require("../models/Commentary.model");
const ApiError = require("../utils/apiError");
const {
  EXTRA_TYPES,
  WICKET_TYPES,
  MATCH_STATUS,
  INNINGS_STATUS,
  PLAYER_STATUS,
} = require("../config/constants");
const {
  isValidDelivery,
  shouldRotateStrike,
  generateCommentary,
  isInningsComplete,
  getBallDisplayValue,
} = require("../utils/cricketHelpers");
const { calculateMatchResult } = require("../utils/statsCalculator");

class ScoringService {
  // ===================================================================
  // RECORD A BALL
  // ===================================================================
  async recordBall(matchId, ballData) {
    const {
      runs,
      extraType = EXTRA_TYPES.NONE,
      extraRuns = 0,
      isWicket = false,
      wicketType = WICKET_TYPES.NONE,
      strikerId,
      nonStrikerId,
      bowlerId,
      dismissedBatterId,
      fielderName,
    } = ballData;

    const match = await Match.findById(matchId);
    if (!match) throw new ApiError(404, "Match not found");
    if (match.status !== MATCH_STATUS.LIVE) {
      throw new ApiError(400, "Match is not live");
    }

    const currentInningsId = match.innings[match.innings.length - 1];
    const innings = await Innings.findById(currentInningsId);
    if (!innings) throw new ApiError(404, "Innings not found");
    if (innings.status === INNINGS_STATUS.COMPLETED) {
      throw new ApiError(400, "Innings already completed");
    }

    // Get striker info
    const strikerBatter = innings.batters.find(
      (b) => b.player.toString() === strikerId
    );
    const nonStrikerBatter = innings.batters.find(
      (b) => b.player.toString() === nonStrikerId
    );
    const currentBowler = innings.bowlers.find(
      (b) => b.player.toString() === bowlerId
    );

    if (!strikerBatter)
      throw new ApiError(400, "Striker not found in batting lineup");
    if (!nonStrikerBatter)
      throw new ApiError(400, "Non-striker not found in batting lineup");
    if (!currentBowler)
      throw new ApiError(400, "Bowler not found in bowling lineup");

    const isValid = isValidDelivery(extraType);
    const totalRunsForBall = runs + extraRuns;

    // Calculate over and ball numbers
    const overNumber = innings.oversCompleted + 1;
    const ballNumber = innings.ballsInCurrentOver + 1;

    // Create ball record
    const strikerPlayer = await Player.findById(strikerId);
    const nonStrikerPlayer = await Player.findById(nonStrikerId);
    const bowlerPlayer = await Player.findById(bowlerId);

    // For extras (wide/no_ball), use current ball number (don't increment)
    let actualBallNumber;
    if (isValid) {
      actualBallNumber = ballNumber;
    } else {
      actualBallNumber =
        innings.ballsInCurrentOver > 0 ? innings.ballsInCurrentOver : 1;
    }

    const ball = await Ball.create({
      match: matchId,
      innings: innings._id,
      inningsNumber: innings.inningsNumber,
      overNumber,
      ballNumber: actualBallNumber,
      runs,
      extraType,
      extraRuns,
      isExtra: extraType !== EXTRA_TYPES.NONE,
      isWicket,
      wicketType: isWicket ? wicketType : WICKET_TYPES.NONE,
      isValidBall: isValid,
      totalRuns: totalRunsForBall,
      striker: {
        player: strikerId,
        playerName: strikerPlayer
          ? strikerPlayer.name
          : strikerBatter.playerName,
      },
      nonStriker: {
        player: nonStrikerId,
        playerName: nonStrikerPlayer
          ? nonStrikerPlayer.name
          : nonStrikerBatter.playerName,
      },
      bowler: {
        player: bowlerId,
        playerName: bowlerPlayer ? bowlerPlayer.name : currentBowler.playerName,
      },
      dismissedBatter:
        isWicket && dismissedBatterId
          ? {
              player: dismissedBatterId,
              playerName:
                innings.batters.find(
                  (b) => b.player.toString() === dismissedBatterId.toString()
                )?.playerName || "",
            }
          : undefined,
      fielder: fielderName ? { playerName: fielderName } : undefined,
      scoreSnapshot: {
        totalRuns: innings.totalRuns,
        wickets: innings.wickets,
        overs: `${innings.oversCompleted}.${innings.ballsInCurrentOver}`,
      },
    });

    // Update innings
    innings.balls.push(ball._id);
    innings.totalRuns += totalRunsForBall;

    // Update extras
    if (extraType === EXTRA_TYPES.WIDE) {
      innings.extras.wides += 1 + extraRuns;
      innings.extras.total += 1 + extraRuns;
    } else if (extraType === EXTRA_TYPES.NO_BALL) {
      innings.extras.noBalls += 1;
      innings.extras.total += 1 + extraRuns;
    } else if (extraType === EXTRA_TYPES.BYE) {
      innings.extras.byes += runs;
      innings.extras.total += runs;
    } else if (extraType === EXTRA_TYPES.LEG_BYE) {
      innings.extras.legByes += runs;
      innings.extras.total += runs;
    }

    // Update striker stats (only if not wide/bye/leg-bye)
    if (extraType === EXTRA_TYPES.NONE || extraType === EXTRA_TYPES.NO_BALL) {
      strikerBatter.runs += runs;
      if (runs === 4) strikerBatter.fours += 1;
      if (runs === 6) strikerBatter.sixes += 1;
    }

    // Count valid balls for striker
    if (isValid) {
      strikerBatter.balls += 1;
    }

    // Update bowler stats
    if (extraType !== EXTRA_TYPES.BYE && extraType !== EXTRA_TYPES.LEG_BYE) {
      currentBowler.runs += totalRunsForBall;
    }

    if (extraType === EXTRA_TYPES.WIDE) {
      currentBowler.wides += 1;
    } else if (extraType === EXTRA_TYPES.NO_BALL) {
      currentBowler.noBalls += 1;
    }

    // Update partnership
    innings.partnership.runs += totalRunsForBall;
    if (isValid) {
      innings.partnership.balls += 1;
    }

    // Update valid ball count and overs
    if (isValid) {
      innings.ballsInCurrentOver += 1;
      currentBowler.balls += 1;
    }

    // Update wicket
    if (isWicket) {
      innings.wickets += 1;

      // Only credit bowler with wicket if NOT a run-out
      if (isValid && wicketType !== WICKET_TYPES.RUN_OUT) {
        currentBowler.wickets += 1;
      }

      // Find dismissed batter (for run-out, could be striker OR non-striker)
      const dismissedPlayerId = dismissedBatterId || strikerId;
      const dismissedBatter = innings.batters.find(
        (b) => b.player.toString() === dismissedPlayerId.toString()
      );

      if (dismissedBatter) {
        dismissedBatter.status = PLAYER_STATUS.OUT;
        dismissedBatter.isStriker = false;

        // Build cricket-style dismissal info
        let dismissalInfo = "";

        if (wicketType === WICKET_TYPES.CAUGHT) {
          dismissalInfo = fielderName
            ? `c ${fielderName} b ${currentBowler.playerName}`
            : `Caught b ${currentBowler.playerName}`;
        } else if (wicketType === WICKET_TYPES.STUMPED) {
          dismissalInfo = fielderName
            ? `st ${fielderName} b ${currentBowler.playerName}`
            : `Stumped b ${currentBowler.playerName}`;
        } else if (wicketType === WICKET_TYPES.RUN_OUT) {
          dismissalInfo = fielderName
            ? `Run Out (${fielderName})`
            : "Run Out";
        } else if (wicketType === WICKET_TYPES.BOWLED) {
          dismissalInfo = `b ${currentBowler.playerName}`;
        } else if (wicketType === WICKET_TYPES.LBW) {
          dismissalInfo = `lbw b ${currentBowler.playerName}`;
        } else if (wicketType === WICKET_TYPES.HIT_WICKET) {
          dismissalInfo = `Hit Wicket b ${currentBowler.playerName}`;
        } else if (wicketType === WICKET_TYPES.RETIRED_HURT) {
          dismissalInfo = "Retired Hurt";
        } else {
          dismissalInfo = wicketType.replace(/_/g, " ").toUpperCase();
        }

        dismissedBatter.dismissalInfo = dismissalInfo;
        dismissedBatter.dismissedBy = {
          bowlerName:
            wicketType !== WICKET_TYPES.RUN_OUT ? currentBowler.playerName : "",
          fielderName: fielderName || "",
        };

        // If striker is out, clear currentStriker
        if (
          dismissedBatter.player.toString() ===
          innings.currentStriker?.toString()
        ) {
          innings.currentStriker = null;
        }
        if (
          dismissedBatter.player.toString() ===
          innings.currentNonStriker?.toString()
        ) {
          innings.currentNonStriker = null;
        }
      }

      // Update last wicket info
      innings.lastWicket = {
        playerName: dismissedBatter?.playerName || "",
        runs: dismissedBatter?.runs || 0,
        balls: dismissedBatter?.balls || 0,
        dismissalInfo: dismissedBatter?.dismissalInfo || "",
        totalScoreAtFall: `${innings.totalRuns}/${innings.wickets}`,
        overAtFall: `${innings.oversCompleted}.${innings.ballsInCurrentOver}`,
        fielderName: fielderName || "",
      };

      // Reset partnership
      innings.partnership = {
        runs: 0,
        balls: 0,
        batter1: innings.currentStriker,
        batter2: innings.currentNonStriker,
      };
    }

    // Check if over is complete
    let isOverComplete = false;
    if (innings.ballsInCurrentOver === 6) {
      isOverComplete = true;
      innings.oversCompleted += 1;
      innings.ballsInCurrentOver = 0;

      // Update bowler overs
      currentBowler.overs += 1;
      currentBowler.balls = 0;

      // Check for maiden over
      if (currentBowler.currentOverRuns === 0) {
        currentBowler.maidens += 1;
      }
      currentBowler.currentOverRuns = 0;
      currentBowler.isCurrentBowler = false;

      // Reset current bowler
      innings.currentBowler = null;
      innings.lastBowler = bowlerId;

      // STEP 1: First rotate based on runs scored on this ball (mid-over logic)
      if (!isWicket) {
        const rotateStrike = shouldRotateStrike(runs, extraType, isWicket);
        if (rotateStrike) {
          const temp = innings.currentStriker;
          innings.currentStriker = innings.currentNonStriker;
          innings.currentNonStriker = temp;
        }
      }

      // STEP 2: Then auto rotate strike at end of over
      const temp = innings.currentStriker;
      innings.currentStriker = innings.currentNonStriker;
      innings.currentNonStriker = temp;

      // Update isStriker flags
      innings.batters.forEach((b) => {
        if (b.status === PLAYER_STATUS.BATTING) {
          b.isStriker =
            b.player.toString() === innings.currentStriker?.toString();
        } else {
          b.isStriker = false;
        }
      });
    } else {
      // Rotate strike mid-over (normal balls only)
      if (!isWicket) {
        const rotateStrike = shouldRotateStrike(runs, extraType, isWicket);
        if (rotateStrike) {
          const temp = innings.currentStriker;
          innings.currentStriker = innings.currentNonStriker;
          innings.currentNonStriker = temp;

          innings.batters.forEach((b) => {
            if (b.status === PLAYER_STATUS.BATTING) {
              b.isStriker =
                b.player.toString() === innings.currentStriker?.toString();
            } else {
              b.isStriker = false;
            }
          });
        }
      }
    }

    // Update recent balls (keep last 24)
    const displayValue = getBallDisplayValue({
      isWicket,
      isExtra: extraType !== EXTRA_TYPES.NONE,
      extraType,
      runs,
      totalRuns: totalRunsForBall,
    });

    innings.recentBalls.push({
      display: displayValue,
      runs: totalRunsForBall,
      isWicket,
      isExtra: extraType !== EXTRA_TYPES.NONE,
      extraType,
      overNumber,
      ballNumber: actualBallNumber,
    });

    if (innings.recentBalls.length > 24) {
      innings.recentBalls = innings.recentBalls.slice(-24);
    }

    // Generate commentary with fielder info
    const commentaryText = generateCommentary({
      runs,
      extraType,
      isWicket,
      wicketType,
      striker: {
        player: strikerId,
        playerName: strikerBatter.playerName,
      },
      nonStriker: {
        player: nonStrikerId,
        playerName: nonStrikerBatter.playerName,
      },
      bowler: {
        player: bowlerId,
        playerName: currentBowler.playerName,
      },
      fielderName: fielderName || "",
      overNumber,
      ballNumber: actualBallNumber,
    });

    await Commentary.create({
      match: matchId,
      innings: innings._id,
      ball: ball._id,
      overNumber,
      ballNumber: actualBallNumber,
      text: commentaryText,
      type: isWicket
        ? "wicket"
        : runs === 6
        ? "six"
        : runs === 4
        ? "boundary"
        : isOverComplete
        ? "over_complete"
        : "ball",
      isImportant: isWicket || runs >= 4,
    });

    ball.commentary = commentaryText;
    await ball.save();

    // ============================================================
    // CRITICAL: Check innings complete with TARGET CHECK
    // ============================================================
    const teamSize = innings.batters?.length || 11;
    const inningsComplete = isInningsComplete(
      innings.wickets,
      innings.oversCompleted,
      innings.ballsInCurrentOver,
      innings.totalOvers,
      teamSize,
      innings.totalRuns,  // ← Pass current runs
      innings.target       // ← Pass target
    );

    if (inningsComplete) {
      innings.status = INNINGS_STATUS.COMPLETED;
      console.log(`🏁 Innings ${innings.inningsNumber} completed!`);
      console.log(`   Score: ${innings.totalRuns}/${innings.wickets}`);
      console.log(`   Target: ${innings.target || "N/A"}`);
    }

    // CRITICAL: Check if MATCH is complete (2nd innings done OR target chased)
    let matchComplete = false;
    if (innings.inningsNumber === 2 && inningsComplete) {
      matchComplete = true;
      console.log("🏆 MATCH COMPLETE!");
    }

    // Mark batters as modified for nested array changes
    innings.markModified("batters");
    innings.markModified("bowlers");

    await innings.save();

    // ============================================================
    // AUTO-END MATCH if it's complete (after 2nd innings)
    // ============================================================
    if (matchComplete) {
      console.log("🎯 Auto-ending match...");
      await this.autoEndMatch(matchId);
    }

    return {
      ball,
      innings: await Innings.findById(innings._id)
        .populate("batters.player")
        .populate("bowlers.player"),
      isOverComplete,
      isWicket,
      inningsComplete,
      matchComplete,
      requireNewBatsman:
        isWicket &&
        innings.wickets < (innings.batters?.length || 11) - 1 &&
        !matchComplete,
      requireNewBowler: isOverComplete && !inningsComplete && !matchComplete,
    };
  }

  // ===================================================================
  // SELECT NEW BATSMAN (after wicket)
  // ===================================================================
  async selectNewBatsman(matchId, playerData) {
    const { playerId, playerName } = playerData;

    const match = await Match.findById(matchId);
    if (!match) throw new ApiError(404, "Match not found");

    const currentInningsId = match.innings[match.innings.length - 1];
    const innings = await Innings.findById(currentInningsId);
    if (!innings) throw new ApiError(404, "Innings not found");

    // Clear isStriker from OUT batters
    innings.batters.forEach((b) => {
      if (b.status === PLAYER_STATUS.OUT) {
        b.isStriker = false;
      }
    });

    // Clear isStriker from all batters except non-striker
    const nonStrikerId = innings.currentNonStriker?.toString();
    innings.batters.forEach((b) => {
      if (b.player.toString() !== nonStrikerId) {
        b.isStriker = false;
      }
    });

    // Find or add the new batter
    let batter = innings.batters.find(
      (b) => b.player.toString() === playerId.toString()
    );

    if (!batter) {
      innings.batters.push({
        player: playerId,
        playerName,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        status: PLAYER_STATUS.BATTING,
        isStriker: true,
        battingOrder: innings.batters.length + 1,
      });
      batter = innings.batters[innings.batters.length - 1];
    } else {
      batter.status = PLAYER_STATUS.BATTING;
      batter.isStriker = true;
    }

    // Set new striker
    innings.currentStriker = playerId;

    // Make sure non-striker is NOT marked as striker
    const nonStrikerBatter = innings.batters.find(
      (b) => b.player.toString() === innings.currentNonStriker?.toString()
    );
    if (nonStrikerBatter) {
      nonStrikerBatter.isStriker = false;
    }

    // Update partnership for new pair
    innings.partnership = {
      runs: 0,
      balls: 0,
      batter1: playerId,
      batter2: innings.currentNonStriker,
    };

    innings.markModified("batters");

    await innings.save();

    // Return fully populated FRESH data
    const updatedInnings = await Innings.findById(innings._id)
      .populate("batters.player")
      .populate("bowlers.player")
      .populate("battingTeam")
      .populate("bowlingTeam");

    console.log(`✅ New batsman selected: ${playerName} (ID: ${playerId})`);

    return updatedInnings;
  }

  // ===================================================================
  // SELECT NEW BOWLER (after over ends)
  // ===================================================================
  async selectNewBowler(matchId, bowlerData) {
    const { playerId, playerName } = bowlerData;

    const match = await Match.findById(matchId);
    if (!match) throw new ApiError(404, "Match not found");

    const currentInningsId = match.innings[match.innings.length - 1];
    const innings = await Innings.findById(currentInningsId);
    if (!innings) throw new ApiError(404, "Innings not found");

    // Cannot bowl consecutive overs
    if (
      innings.lastBowler &&
      innings.lastBowler.toString() === playerId.toString()
    ) {
      throw new ApiError(400, "Bowler cannot bowl consecutive overs");
    }

    // Find existing bowler or create new entry
    let bowler = innings.bowlers.find(
      (b) => b.player.toString() === playerId.toString()
    );

    if (!bowler) {
      innings.bowlers.push({
        player: playerId,
        playerName,
        overs: 0,
        balls: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
        wides: 0,
        noBalls: 0,
        currentOverRuns: 0,
        isCurrentBowler: true,
      });
      bowler = innings.bowlers[innings.bowlers.length - 1];
    } else {
      bowler.isCurrentBowler = true;
    }

    // Set all others as not current
    innings.bowlers.forEach((b) => {
      if (b.player.toString() !== playerId.toString()) {
        b.isCurrentBowler = false;
      }
    });

    innings.currentBowler = playerId;

    innings.markModified("bowlers");
    await innings.save();

    // Return fully populated FRESH data
    const updatedInnings = await Innings.findById(innings._id)
      .populate("batters.player")
      .populate("bowlers.player")
      .populate("battingTeam")
      .populate("bowlingTeam");

    console.log(`✅ New bowler selected: ${playerName} (ID: ${playerId})`);

    return updatedInnings;
  }

  // ===================================================================
  // UNDO LAST BALL
  // ===================================================================
  async undoLastBall(matchId) {
    const match = await Match.findById(matchId);
    if (!match) throw new ApiError(404, "Match not found");

    const currentInningsId = match.innings[match.innings.length - 1];
    const innings = await Innings.findById(currentInningsId);
    if (!innings) throw new ApiError(404, "Innings not found");

    if (innings.balls.length === 0) {
      throw new ApiError(400, "No balls to undo");
    }

    // Get last ball
    const lastBallId = innings.balls[innings.balls.length - 1];
    const lastBall = await Ball.findById(lastBallId);
    if (!lastBall) throw new ApiError(404, "Last ball not found");

    // Reverse innings stats
    innings.totalRuns -= lastBall.totalRuns;

    // Reverse extras
    if (lastBall.extraType === EXTRA_TYPES.WIDE) {
      innings.extras.wides -= 1 + lastBall.extraRuns;
      innings.extras.total -= 1 + lastBall.extraRuns;
    } else if (lastBall.extraType === EXTRA_TYPES.NO_BALL) {
      innings.extras.noBalls -= 1;
      innings.extras.total -= 1 + lastBall.extraRuns;
    } else if (lastBall.extraType === EXTRA_TYPES.BYE) {
      innings.extras.byes -= lastBall.runs;
      innings.extras.total -= lastBall.runs;
    } else if (lastBall.extraType === EXTRA_TYPES.LEG_BYE) {
      innings.extras.legByes -= lastBall.runs;
      innings.extras.total -= lastBall.runs;
    }

    // Reverse batter stats
    const strikerBatter = innings.batters.find(
      (b) => b.player.toString() === lastBall.striker.player.toString()
    );

    if (
      strikerBatter &&
      (lastBall.extraType === EXTRA_TYPES.NONE ||
        lastBall.extraType === EXTRA_TYPES.NO_BALL)
    ) {
      strikerBatter.runs -= lastBall.runs;
      if (lastBall.runs === 4) strikerBatter.fours -= 1;
      if (lastBall.runs === 6) strikerBatter.sixes -= 1;
    }

    if (lastBall.isValidBall && strikerBatter) {
      strikerBatter.balls -= 1;
    }

    // Reverse bowler stats
    const bowler = innings.bowlers.find(
      (b) => b.player.toString() === lastBall.bowler.player.toString()
    );

    if (bowler) {
      if (
        lastBall.extraType !== EXTRA_TYPES.BYE &&
        lastBall.extraType !== EXTRA_TYPES.LEG_BYE
      ) {
        bowler.runs -= lastBall.totalRuns;
      }
      if (lastBall.extraType === EXTRA_TYPES.WIDE) {
        bowler.wides -= 1;
      } else if (lastBall.extraType === EXTRA_TYPES.NO_BALL) {
        bowler.noBalls -= 1;
      }
      if (lastBall.isValidBall) {
        if (innings.ballsInCurrentOver === 0) {
          innings.oversCompleted -= 1;
          innings.ballsInCurrentOver = 5;
          bowler.overs -= 1;
          bowler.balls = 5;
        } else {
          innings.ballsInCurrentOver -= 1;
          bowler.balls -= 1;
        }
      }

      if (lastBall.isWicket && lastBall.wicketType !== WICKET_TYPES.RUN_OUT) {
        bowler.wickets -= 1;
      }
    }

    // Reverse wicket
    if (lastBall.isWicket) {
      innings.wickets -= 1;
      const dismissedBatter = innings.batters.find(
        (b) =>
          b.player.toString() ===
          (lastBall.dismissedBatter?.player?.toString() ||
            lastBall.striker.player.toString())
      );
      if (dismissedBatter) {
        dismissedBatter.status = PLAYER_STATUS.BATTING;
        dismissedBatter.dismissalInfo = "";
        dismissedBatter.dismissedBy = {
          bowlerName: "",
          fielderName: "",
        };
      }
    }

    // Reverse partnership
    innings.partnership.runs -= lastBall.totalRuns;
    if (lastBall.isValidBall) {
      innings.partnership.balls -= 1;
    }

    // Remove last ball from innings and recentBalls
    innings.balls.pop();
    if (innings.recentBalls.length > 0) {
      innings.recentBalls.pop();
    }

    // Delete ball from DB
    await Ball.findByIdAndDelete(lastBallId);

    // Delete last commentary
    await Commentary.findOneAndDelete({
      match: matchId,
      innings: innings._id,
      ball: lastBallId,
    });

    innings.markModified("batters");
    innings.markModified("bowlers");

    await innings.save();

    return await Innings.findById(innings._id)
      .populate("batters.player")
      .populate("bowlers.player");
  }

  // ===================================================================
  // END INNINGS
  // ===================================================================
  async endInnings(matchId) {
    const match = await Match.findById(matchId);
    if (!match) throw new ApiError(404, "Match not found");

    const currentInningsId = match.innings[match.innings.length - 1];
    const innings = await Innings.findById(currentInningsId);
    if (!innings) throw new ApiError(404, "Innings not found");

    innings.status = INNINGS_STATUS.COMPLETED;
    await innings.save();

    await Commentary.create({
      match: matchId,
      innings: innings._id,
      text: `Innings ${innings.inningsNumber} complete! ${innings.battingTeamName} scored ${innings.totalRuns}/${innings.wickets} in ${innings.oversCompleted}.${innings.ballsInCurrentOver} overs.`,
      type: "innings_end",
      isImportant: true,
    });

    return innings;
  }

  // ===================================================================
  // START SECOND INNINGS
  // ===================================================================
  async startSecondInnings(matchId, openingBatsmen, openingBowler) {
    const match = await Match.findById(matchId);
    if (!match) throw new ApiError(404, "Match not found");

    if (match.innings.length !== 1) {
      throw new ApiError(
        400,
        "Second innings already started or match not ready"
      );
    }

    const firstInnings = await Innings.findById(match.innings[0]);
    if (!firstInnings || firstInnings.status !== INNINGS_STATUS.COMPLETED) {
      throw new ApiError(400, "First innings not completed");
    }

    const target = firstInnings.totalRuns + 1;

    const battingTeam = await Team.findById(firstInnings.bowlingTeam).populate(
      "players.player"
    );
    const bowlingTeam = await Team.findById(firstInnings.battingTeam).populate(
      "players.player"
    );

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

    const striker = batterStats.find(
      (b) => b.player.toString() === openingBatsmen.striker
    );
    const nonStriker = batterStats.find(
      (b) => b.player.toString() === openingBatsmen.nonStriker
    );

    if (striker) {
      striker.status = "batting";
      striker.isStriker = true;
    }
    if (nonStriker) {
      nonStriker.status = "batting";
      nonStriker.isStriker = false;
    }

    const openingBowlerPlayer = bowlingTeam.players.find(
      (p) => p.player._id.toString() === openingBowler.playerId
    );

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

    const secondInnings = await Innings.create({
      match: matchId,
      inningsNumber: 2,
      battingTeam: battingTeam._id,
      battingTeamName: battingTeam.name,
      bowlingTeam: bowlingTeam._id,
      bowlingTeamName: bowlingTeam.name,
      totalOvers: match.totalOvers,
      target,
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

    match.innings.push(secondInnings._id);
    match.currentInnings = 2;
    await match.save();

    return await Innings.findById(secondInnings._id)
      .populate("batters.player")
      .populate("bowlers.player");
  }

  // ===================================================================
  // AUTO END MATCH (NEW - when target chased or 2nd innings complete)
  // ===================================================================
  async autoEndMatch(matchId) {
    try {
      const match = await Match.findById(matchId);
      if (!match) {
        console.error("❌ Match not found for auto-end:", matchId);
        return;
      }

      if (match.status === MATCH_STATUS.COMPLETED) {
        console.log("ℹ️ Match already completed");
        return match;
      }

      if (match.innings.length !== 2) {
        console.log("⚠️ Cannot auto-end - not in 2nd innings");
        return match;
      }

      const innings1 = await Innings.findById(match.innings[0]);
      const innings2 = await Innings.findById(match.innings[1]);

      if (!innings1 || !innings2) {
        console.error("❌ Innings data missing");
        return match;
      }

      // Make sure 2nd innings is marked complete
      if (innings2.status !== INNINGS_STATUS.COMPLETED) {
        innings2.status = INNINGS_STATUS.COMPLETED;
        await innings2.save();
      }

      // Calculate match result
      const result = calculateMatchResult(innings1, innings2);

      match.result = {
        type: result?.type || "no_result",
        winnerName: result?.winnerName || "",
        winner: result?.winnerTeam || null,
        margin: result?.margin || 0,
        marginType: result?.marginType || "",
        description: result?.description || "Match Ended",
        manOfTheMatch: {},
      };

      match.status = MATCH_STATUS.COMPLETED;
      await match.save();

      // Create commentary for match end
      await Commentary.create({
        match: matchId,
        innings: innings2._id,
        text: `🏆 ${match.result.description}`,
        type: "match_end",
        isImportant: true,
      });

      console.log(`🏆 Match auto-ended! Result: ${match.result.description}`);

      return match;
    } catch (error) {
      console.error("❌ Auto-end match error:", error);
    }
  }

  // ===================================================================
  // END MATCH (manual)
  // ===================================================================
  async endMatch(matchId, resultData) {
    const match = await Match.findById(matchId);
    if (!match) throw new ApiError(404, "Match not found");

    if (match.innings.length === 2) {
      const innings1 = await Innings.findById(match.innings[0]);
      const innings2 = await Innings.findById(match.innings[1]);

      if (innings2) {
        innings2.status = INNINGS_STATUS.COMPLETED;
        await innings2.save();
      }

      const result = calculateMatchResult(innings1, innings2);

      match.result = {
        type: result?.type || resultData?.type || "no_result",
        winnerName: result?.winnerName || resultData?.winnerName,
        winner: result?.winnerTeam || null,
        margin: result?.margin || 0,
        marginType: result?.marginType || "",
        description:
          result?.description || resultData?.description || "Match Ended",
        manOfTheMatch: resultData?.manOfTheMatch || {},
      };
    } else if (resultData) {
      match.result = resultData;
    } else {
      match.result = {
        type: "abandoned",
        description: "Match Abandoned",
      };
    }

    match.status = MATCH_STATUS.COMPLETED;
    await match.save();

    await Commentary.create({
      match: matchId,
      innings: match.innings[match.innings.length - 1],
      text: match.result.description || "Match has ended.",
      type: "match_end",
      isImportant: true,
    });

    return await Match.findById(matchId)
      .populate("teamA.team")
      .populate("teamB.team")
      .populate({
        path: "innings",
        populate: [
          { path: "batters.player" },
          { path: "bowlers.player" },
        ],
      });
  }
}

module.exports = new ScoringService();