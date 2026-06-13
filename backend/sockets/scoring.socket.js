const { SOCKET_EVENTS } = require("../config/constants");

const handleScoringSockets = (io, socket) => {
  // Admin broadcasts score update manually (fallback)
  socket.on("admin_score_update", ({ matchId, scoreData }) => {
    if (matchId && scoreData) {
      io.to(`match_${matchId}`).emit(SOCKET_EVENTS.SCORE_UPDATED, {
        matchId,
        ...scoreData,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Viewer requesting over summary
  socket.on("request_over_summary", ({ matchId, inningsId }) => {
    socket.emit("over_summary_requested", {
      matchId,
      inningsId,
      timestamp: new Date().toISOString(),
    });
  });
};

module.exports = { handleScoringSockets };