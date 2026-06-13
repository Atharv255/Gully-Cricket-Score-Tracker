export const validateMatchForm = (data) => {
  const errors = {};

  if (!data.title?.trim()) errors.title = "Match title is required";
  if (!data.groundName?.trim()) errors.groundName = "Ground name is required";
  if (!data.matchDate) errors.matchDate = "Match date is required";
  if (!data.totalOvers || data.totalOvers < 1 || data.totalOvers > 50) {
    errors.totalOvers = "Total overs must be between 1 and 50";
  }
  if (!data.teamA?.name?.trim()) errors.teamAName = "Team A name is required";
  if (!data.teamA?.captain?.trim())
    errors.teamACaptain = "Team A captain is required";
  if (!data.teamA?.players?.length || data.teamA.players.length < 2) {
    errors.teamAPlayers = "Team A must have at least 2 players";
  }
  if (!data.teamB?.name?.trim()) errors.teamBName = "Team B name is required";
  if (!data.teamB?.captain?.trim())
    errors.teamBCaptain = "Team B captain is required";
  if (!data.teamB?.players?.length || data.teamB.players.length < 2) {
    errors.teamBPlayers = "Team B must have at least 2 players";
  }
  if (!data.toss?.winner?.trim()) errors.tossWinner = "Toss winner is required";
  if (!data.toss?.decision) errors.tossDecision = "Toss decision is required";

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateEmail = (email) => {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6 && /\d/.test(password);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== "";
};