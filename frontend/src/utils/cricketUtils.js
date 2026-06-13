export const calculateRunRate = (runs, overs, balls) => {
  const totalBalls = (overs || 0) * 6 + (balls || 0);
  if (totalBalls === 0) return "0.00";
  return ((runs / totalBalls) * 6).toFixed(2);
};

export const calculateRequiredRunRate = (
  target,
  currentRuns,
  totalOvers,
  oversCompleted,
  ballsInCurrentOver
) => {
  const runsRequired = (target || 0) - (currentRuns || 0);
  const totalBalls = (totalOvers || 0) * 6;
  const ballsBowled =
    (oversCompleted || 0) * 6 + (ballsInCurrentOver || 0);
  const ballsRemaining = totalBalls - ballsBowled;

  if (ballsRemaining <= 0) return "0.00";
  if (runsRequired <= 0) return "0.00";
  return ((runsRequired / ballsRemaining) * 6).toFixed(2);
};

export const calculateStrikeRate = (runs, balls) => {
  if (!balls || balls === 0) return "0.00";
  return ((runs / balls) * 100).toFixed(2);
};

export const getRemainingBalls = (totalOvers, oversCompleted, balls) => {
  const totalBalls = totalOvers * 6;
  const bowled = oversCompleted * 6 + balls;
  return totalBalls - bowled;
};

export const getRequiredRuns = (target, currentRuns) => {
  return Math.max(0, (target || 0) - (currentRuns || 0));
};

export const isMatchWonByChasing = (target, currentRuns) => {
  return currentRuns >= target;
};

export const getWicketDescription = (wicketType) => {
  const descriptions = {
    bowled: "Bowled",
    caught: "Caught",
    run_out: "Run Out",
    lbw: "LBW",
    stumped: "Stumped",
    hit_wicket: "Hit Wicket",
    retired_hurt: "Retired Hurt",
  };
  return descriptions[wicketType] || wicketType;
};

export const groupBallsByOver = (balls) => {
  const overs = {};
  balls.forEach((ball) => {
    const key = ball.overNumber;
    if (!overs[key]) {
      overs[key] = { overNumber: key, balls: [], runs: 0, wickets: 0 };
    }
    overs[key].balls.push(ball);
    overs[key].runs += ball.totalRuns || 0;
    if (ball.isWicket) overs[key].wickets += 1;
  });
  return Object.values(overs).sort((a, b) => a.overNumber - b.overNumber);
};