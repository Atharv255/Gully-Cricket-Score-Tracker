import { format, formatDistanceToNow } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "N/A";
  return format(new Date(date), "dd MMM yyyy");
};

export const formatDateTime = (date) => {
  if (!date) return "N/A";
  return format(new Date(date), "dd MMM yyyy, hh:mm a");
};

export const formatTimeAgo = (date) => {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatOvers = (oversCompleted, balls) => {
  return `${oversCompleted}.${balls || 0}`;
};

export const formatScore = (runs, wickets) => {
  return `${runs}/${wickets}`;
};

export const formatRunRate = (value) => {
  return parseFloat(value || 0).toFixed(2);
};

export const formatStrikeRate = (runs, balls) => {
  if (!balls || balls === 0) return "0.00";
  return ((runs / balls) * 100).toFixed(2);
};

export const formatEconomy = (runs, overs, balls) => {
  const totalBalls = (overs || 0) * 6 + (balls || 0);
  if (totalBalls === 0) return "0.00";
  return ((runs / totalBalls) * 6).toFixed(2);
};

export const getBallColorClass = (ball) => {
  if (ball.isWicket || ball.display === "W") return "ball-wicket";
  if (ball.display === "4" || ball.runs === 4) return "ball-four";
  if (ball.display === "6" || ball.runs === 6) return "ball-six";
  if (ball.display === "0" || ball.runs === 0) return "ball-dot-zero";
  if (ball.isExtra) return "ball-extra";
  return "ball-normal";
};

export const getMatchStatusColor = (status) => {
  switch (status) {
    case "live":
      return "text-red-400 bg-red-950 border-red-800";
    case "upcoming":
      return "text-blue-400 bg-blue-950 border-blue-800";
    case "completed":
      return "text-green-400 bg-green-950 border-green-800";
    case "abandoned":
      return "text-gray-400 bg-gray-900 border-gray-700";
    default:
      return "text-gray-400 bg-gray-900 border-gray-700";
  }
};

export const getMatchStatusLabel = (status) => {
  switch (status) {
    case "live": return "LIVE";
    case "upcoming": return "UPCOMING";
    case "completed": return "COMPLETED";
    case "abandoned": return "ABANDONED";
    default: return status?.toUpperCase() || "UNKNOWN";
  }
};