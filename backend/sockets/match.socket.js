const { SOCKET_EVENTS } = require("../config/constants");
const liveService = require("../services/live.service");

const handleMatchSockets = (io, socket) => {
  // Request live score
  socket.on("request_live_score", async ({ matchId }) => {
    try {
      if (!matchId) return;

      const liveScore = await liveService.getLiveScore(matchId);
      socket.emit(SOCKET_EVENTS.LIVE_SCORE, {
        matchId,
        liveScore,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      socket.emit("error", {
        message: "Failed to fetch live score",
        error: error.message,
      });
    }
  });

  // Request match list
  socket.on("request_live_matches", async () => {
    try {
      const matches = await liveService.getLiveMatches();
      socket.emit("live_matches", {
        matches,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      socket.emit("error", {
        message: "Failed to fetch live matches",
        error: error.message,
      });
    }
  });

  // Ping-pong for connection health
  socket.on("ping_match", ({ matchId }) => {
    socket.emit("pong_match", {
      matchId,
      timestamp: new Date().toISOString(),
    });
  });
};

module.exports = { handleMatchSockets };