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
    overNumber,
    ballNumber,
  } = ballData;

  let commentary = `${overNumber}.${ballNumber} ${bowler.playerName} to ${striker.playerName}: `;

  if (isWicket) {
    switch (wicketType) {
      case WICKET_TYPES.BOWLED:
        commentary += `OUT! ${striker.playerName} is BOWLED! What a delivery!`;
        break;
      case WICKET_TYPES.CAUGHT:
        commentary += `OUT! ${striker.playerName} is CAUGHT! Taken cleanly!`;
        break;
      case WICKET_TYPES.LBW:
        commentary += `OUT! LBW! ${striker.playerName} is given out!`;
        break;
      case WICKET_TYPES.STUMPED:
        commentary += `OUT! STUMPED! ${striker.playerName} is out of his crease!`;
        break;
      case WICKET_TYPES.RUN_OUT:
        commentary += `OUT! RUN OUT! What a throw!`;
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
    commentary += `No Ball! ${runs > 0 ? `${runs} run(s) off the bat plus no ball.` : "Free hit coming up!"}`;
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
 * Check if innings is complete
 */
const isInningsComplete = (
  wickets,
  oversCompleted,
  ballsInCurrentOver,
  totalOvers,
  totalPlayers = 11
) => {
  // Max wickets = team size - 1 (need 2 batters at crease)
  const maxWickets = Math.max(1, totalPlayers - 1);
  const totalBalls = totalOvers * 6;
  const ballsBowled = oversCompleted * 6 + ballsInCurrentOver;
  return wickets >= maxWickets || ballsBowled >= totalBalls;
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
  getBallDisplayValue,
};