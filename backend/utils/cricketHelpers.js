const { EXTRA_TYPES, WICKET_TYPES } = require("../config/constants");

/**
 * Check if a ball is a valid delivery (counts toward over)
 */
const isValidDelivery = (extraType) => {
  return (
    extraType === EXTRA_TYPES.NONE ||
    extraType === EXTRA_TYPES.BYE ||
    extraType === EXTRA_TYPES.LEG_BYE
  );
};

/**
 * Check if strike should rotate after this delivery
 */
const shouldRotateStrike = (runs, extraType, isWicket) => {
  if (isWicket) return false;

  // Wide doesn't rotate strike
  if (extraType === EXTRA_TYPES.WIDE) return false;

  // No ball - check runs off bat
  if (extraType === EXTRA_TYPES.NO_BALL) {
    return runs % 2 !== 0;
  }

  // Byes and Leg Byes - check runs
  if (extraType === EXTRA_TYPES.BYE || extraType === EXTRA_TYPES.LEG_BYE) {
    return runs % 2 !== 0;
  }

  // Normal delivery - odd runs rotate strike
  return runs % 2 !== 0;
};

/**
 * Calculate run rate
 */
const calculateRunRate = (runs, oversCompleted, ballsInCurrentOver) => {
  const totalBalls = oversCompleted * 6 + ballsInCurrentOver;
  if (totalBalls === 0) return "0.00";
  return ((runs / totalBalls) * 6).toFixed(2);
};

/**
 * Calculate required run rate
 */
const calculateRequiredRunRate = (
  target,
  currentRuns,
  totalOvers,
  oversCompleted,
  ballsInCurrentOver
) => {
  const runsRequired = target - currentRuns;
  const totalBalls = totalOvers * 6;
  const ballsBowled = oversCompleted * 6 + ballsInCurrentOver;
  const ballsRemaining = totalBalls - ballsBowled;

  if (ballsRemaining <= 0) return "0.00";
  if (runsRequired <= 0) return "0.00";

  return ((runsRequired / ballsRemaining) * 6).toFixed(2);
};

/**
 * Calculate strike rate
 */
const calculateStrikeRate = (runs, balls) => {
  if (balls === 0) return "0.00";
  return ((runs / balls) * 100).toFixed(2);
};

/**
 * Calculate economy rate
 */
const calculateEconomy = (runs, overs, balls) => {
  const totalBalls = overs * 6 + balls;
  if (totalBalls === 0) return "0.00";
  return ((runs / totalBalls) * 6).toFixed(2);
};

/**
 * Format overs display
 */
const formatOvers = (oversCompleted, ballsInCurrentOver) => {
  return `${oversCompleted}.${ballsInCurrentOver}`;
};

/**
 * Generate commentary text for a ball
 */
const generateCommentary = (ballData) => {
  const {
    runs,
    extraType,
    isWicket,
    wicketType,
    striker,
    bowler,
    fielderName,
    overNumber,
    ballNumber,
  } = ballData;

  let commentary = `${overNumber}.${ballNumber} ${bowler.playerName} to ${striker.playerName}: `;

  if (isWicket) {
    switch (wicketType) {
      case WICKET_TYPES.BOWLED:
        commentary += `OUT! ${striker.playerName} is BOWLED by ${bowler.playerName}! What a delivery!`;
        break;
      case WICKET_TYPES.CAUGHT:
        commentary += fielderName
          ? `OUT! ${striker.playerName} is CAUGHT by ${fielderName} off ${bowler.playerName}!`
          : `OUT! ${striker.playerName} is CAUGHT!`;
        break;
      case WICKET_TYPES.LBW:
        commentary += `OUT! LBW! ${striker.playerName} is given out!`;
        break;
      case WICKET_TYPES.STUMPED:
        commentary += fielderName
          ? `OUT! STUMPED by ${fielderName}! ${striker.playerName} is out!`
          : `OUT! STUMPED!`;
        break;
      case WICKET_TYPES.RUN_OUT:
        commentary += fielderName
          ? `OUT! RUN OUT by ${fielderName}!`
          : `OUT! RUN OUT! What a throw!`;
        break;
      case WICKET_TYPES.HIT_WICKET:
        commentary += `OUT! HIT WICKET! What an unfortunate dismissal!`;
        break;
      default:
        commentary += `OUT! ${striker.playerName} is dismissed!`;
    }
  } else if (extraType === EXTRA_TYPES.WIDE) {
    commentary += `Wide ball! Extra run to the batting team.`;
  } else if (extraType === EXTRA_TYPES.NO_BALL) {
    commentary += `No Ball! ${
      runs > 0
        ? `${runs} run(s) off the bat plus no ball.`
        : "Free hit coming up!"
    }`;
  } else if (extraType === EXTRA_TYPES.BYE) {
    commentary += `Bye! ${runs} run(s) - missed by the wicketkeeper!`;
  } else if (extraType === EXTRA_TYPES.LEG_BYE) {
    commentary += `Leg Bye! ${runs} run(s) off the pad!`;
  } else if (runs === 0) {
    commentary += `Dot ball! Good delivery from ${bowler.playerName}.`;
  } else if (runs === 4) {
    commentary += `FOUR! Brilliant shot by ${striker.playerName}! Racing to the boundary!`;
  } else if (runs === 6) {
    commentary += `SIX! Massive hit by ${striker.playerName}! Over the boundary!`;
  } else {
    commentary += `${runs} run${runs > 1 ? "s" : ""} taken.`;
  }

  return commentary;
};

/**
 * Check if innings is complete - UPDATED WITH TARGET CHECK
 */
const isInningsComplete = (
  wickets,
  oversCompleted,
  ballsInCurrentOver,
  totalOvers,
  totalPlayers = 11,
  totalRuns = 0,
  target = null
) => {
  // Max wickets = team size - 1 (need 2 batters at crease)
  const maxWickets = Math.max(1, totalPlayers - 1);
  const totalBalls = totalOvers * 6;
  const ballsBowled = oversCompleted * 6 + ballsInCurrentOver;

  // Check 1: All out
  if (wickets >= maxWickets) {
    console.log("✅ Innings complete: All out");
    return true;
  }

  // Check 2: All overs bowled
  if (ballsBowled >= totalBalls) {
    console.log("✅ Innings complete: All overs bowled");
    return true;
  }

  // Check 3: Target chased (only for 2nd innings)
  if (target !== null && target !== undefined && totalRuns >= target) {
    console.log(
      `✅ Innings complete: Target ${target} chased! (Scored: ${totalRuns})`
    );
    return true;
  }

  return false;
};

/**
 * Check if match is complete
 */
const isMatchComplete = (
  currentInningsNumber,
  inningsStatus,
  target,
  totalRuns
) => {
  // 2nd innings completed = match over
  if (currentInningsNumber === 2 && inningsStatus === "completed") {
    return true;
  }

  // Target chased in 2nd innings = match over
  if (currentInningsNumber === 2 && target !== null && totalRuns >= target) {
    return true;
  }

  return false;
};

/**
 * Get display value for a ball in recent balls widget
 */
const getBallDisplayValue = (ball) => {
  if (ball.isWicket) return "W";
  if (ball.extraType === EXTRA_TYPES.WIDE) return "Wd";
  if (ball.extraType === EXTRA_TYPES.NO_BALL)
    return ball.runs > 0 ? `${ball.runs + 1}nb` : "nb";
  if (ball.extraType === EXTRA_TYPES.BYE) return `${ball.runs}b`;
  if (ball.extraType === EXTRA_TYPES.LEG_BYE) return `${ball.runs}lb`;
  return `${ball.runs}`;
};

module.exports = {
  isValidDelivery,
  shouldRotateStrike,
  calculateRunRate,
  calculateRequiredRunRate,
  calculateStrikeRate,
  calculateEconomy,
  formatOvers,
  generateCommentary,
  isInningsComplete,
  isMatchComplete,
  getBallDisplayValue,
};