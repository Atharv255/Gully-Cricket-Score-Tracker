/**
 * Calculate complete match statistics
 */
const calculateBatterStats = (batter) => {
  const strikeRate =
    batter.balls > 0
      ? ((batter.runs / batter.balls) * 100).toFixed(2)
      : "0.00";

  return {
    ...batter,
    strikeRate: parseFloat(strikeRate),
  };
};

const calculateBowlerStats = (bowler) => {
  const totalBalls = bowler.overs * 6 + bowler.balls;
  const economy =
    totalBalls > 0 ? ((bowler.runs / totalBalls) * 6).toFixed(2) : "0.00";

  const oversDisplay = `${bowler.overs}.${bowler.balls}`;

  return {
    ...bowler,
    economy: parseFloat(economy),
    oversDisplay,
  };
};

const calculateMatchResult = (innings1, innings2) => {
  if (!innings1 || !innings2) return null;

  const team1Score = innings1.totalRuns;
  const team2Score = innings2.totalRuns;
  const maxWickets = 10;

  if (team2Score > team1Score) {
    const wicketsRemaining = maxWickets - innings2.wickets;
    return {
      type: "win_by_wickets",
      winnerTeam: innings2.battingTeam,
      winnerName: innings2.battingTeamName,
      margin: wicketsRemaining,
      marginType: "wickets",
      description: `${innings2.battingTeamName} won by ${wicketsRemaining} wicket${wicketsRemaining !== 1 ? "s" : ""}`,
    };
  } else if (team1Score > team2Score) {
    const runDiff = team1Score - team2Score;
    return {
      type: "win_by_runs",
      winnerTeam: innings1.battingTeam,
      winnerName: innings1.battingTeamName,
      margin: runDiff,
      marginType: "runs",
      description: `${innings1.battingTeamName} won by ${runDiff} run${runDiff !== 1 ? "s" : ""}`,
    };
  } else {
    return {
      type: "tie",
      description: "Match Tied!",
    };
  }
};

module.exports = {
  calculateBatterStats,
  calculateBowlerStats,
  calculateMatchResult,
};