const { getIO } = require("../config/socket");
const { SOCKET_EVENTS } = require("../config/constants");

class SocketService {
  emitToMatch(matchId, event, data) {
    try {
      const io = getIO();
      io.to(`match_${matchId}`).emit(event, {
        ...data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Socket emit error:", error.message);
    }
  }

  emitScoreUpdate(matchId, scoreData) {
    this.emitToMatch(matchId, SOCKET_EVENTS.SCORE_UPDATED, {
      matchId,
      ...scoreData,
    });
  }

  emitWicket(matchId, wicketData) {
    this.emitToMatch(matchId, SOCKET_EVENTS.WICKET_FELL, {
      matchId,
      ...wicketData,
    });
  }

  emitOverComplete(matchId, overData) {
    this.emitToMatch(matchId, SOCKET_EVENTS.OVER_COMPLETED, {
      matchId,
      ...overData,
    });
  }

  emitInningsEnd(matchId, inningsData) {
    this.emitToMatch(matchId, SOCKET_EVENTS.INNINGS_ENDED, {
      matchId,
      ...inningsData,
    });
  }

  emitMatchEnd(matchId, resultData) {
    this.emitToMatch(matchId, SOCKET_EVENTS.MATCH_ENDED, {
      matchId,
      ...resultData,
    });
  }

  emitBatsmanChanged(matchId, batsmanData) {
    this.emitToMatch(matchId, SOCKET_EVENTS.BATSMAN_CHANGED, {
      matchId,
      ...batsmanData,
    });
  }

  emitBowlerChanged(matchId, bowlerData) {
    this.emitToMatch(matchId, SOCKET_EVENTS.BOWLER_CHANGED, {
      matchId,
      ...bowlerData,
    });
  }

  emitCommentary(matchId, commentaryData) {
    this.emitToMatch(matchId, SOCKET_EVENTS.COMMENTARY_ADDED, {
      matchId,
      ...commentaryData,
    });
  }

  emitBallRecorded(matchId, ballData) {
    this.emitToMatch(matchId, SOCKET_EVENTS.BALL_RECORDED, {
      matchId,
      ...ballData,
    });
  }

  emitBallUndone(matchId, data) {
    this.emitToMatch(matchId, SOCKET_EVENTS.BALL_UNDONE, {
      matchId,
      ...data,
    });
  }

  emitMatchStarted(matchId, matchData) {
    this.emitToMatch(matchId, SOCKET_EVENTS.MATCH_STARTED, {
      matchId,
      ...matchData,
    });
  }

  emitLiveScore(matchId, scoreData) {
    this.emitToMatch(matchId, SOCKET_EVENTS.LIVE_SCORE, {
      matchId,
      ...scoreData,
    });
  }
}

module.exports = new SocketService();