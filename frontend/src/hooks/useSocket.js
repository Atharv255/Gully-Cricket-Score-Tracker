import { useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import socketService from "../services/socketService";
import { setConnected, setDisconnected } from "../features/socket/socketSlice";
import { setCurrentLiveScore, updateLiveScore } from "../features/live/liveSlice";
import { SOCKET_EVENTS } from "../utils/constants";

const useSocket = (matchId, options = {}) => {
  const dispatch = useDispatch();
  const { onScoreUpdate, onWicket, onOverComplete, onInningsEnd, onMatchEnd, onBallRecorded } = options;
  const listenersRef = useRef([]);

  const addListener = useCallback((event, handler) => {
    socketService.on(event, handler);
    listenersRef.current.push({ event, handler });
  }, []);

  useEffect(() => {
    const socket = socketService.connect();

    const handleConnect = () => {
      dispatch(setConnected({ connected: true, socketId: socket.id }));
    };

    const handleDisconnect = () => {
      dispatch(setDisconnected());
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      dispatch(setConnected({ connected: true, socketId: socket.id }));
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!matchId) return;

    socketService.joinMatch(matchId);

    // Score updated
    const handleScoreUpdate = (data) => {
      if (data.liveScore) {
        dispatch(setCurrentLiveScore(data.liveScore));
      }
      onScoreUpdate?.(data);
    };

    // Wicket fell
    const handleWicket = (data) => {
      if (data.liveScore) {
        dispatch(setCurrentLiveScore(data.liveScore));
      }
      onWicket?.(data);
    };

    // Over complete
    const handleOverComplete = (data) => {
      if (data.liveScore) {
        dispatch(setCurrentLiveScore(data.liveScore));
      }
      onOverComplete?.(data);
    };

    // Innings ended
    const handleInningsEnd = (data) => {
      if (data.liveScore) {
        dispatch(setCurrentLiveScore(data.liveScore));
      }
      onInningsEnd?.(data);
    };

    // Match ended
    const handleMatchEnd = (data) => {
      onMatchEnd?.(data);
    };

    // Ball recorded
    const handleBallRecorded = (data) => {
      if (data.liveScore) {
        dispatch(setCurrentLiveScore(data.liveScore));
      }
      onBallRecorded?.(data);
    };

    addListener(SOCKET_EVENTS.SCORE_UPDATED, handleScoreUpdate);
    addListener(SOCKET_EVENTS.WICKET_FELL, handleWicket);
    addListener(SOCKET_EVENTS.OVER_COMPLETED, handleOverComplete);
    addListener(SOCKET_EVENTS.INNINGS_ENDED, handleInningsEnd);
    addListener(SOCKET_EVENTS.MATCH_ENDED, handleMatchEnd);
    addListener(SOCKET_EVENTS.BALL_RECORDED, handleBallRecorded);
    addListener(SOCKET_EVENTS.BATSMAN_CHANGED, handleScoreUpdate);
    addListener(SOCKET_EVENTS.BOWLER_CHANGED, handleScoreUpdate);
    addListener(SOCKET_EVENTS.LIVE_SCORE, (data) => {
      if (data.liveScore) dispatch(setCurrentLiveScore(data.liveScore));
    });

    socketService.requestLiveScore(matchId);

    return () => {
      listenersRef.current.forEach(({ event, handler }) => {
        socketService.off(event, handler);
      });
      listenersRef.current = [];
      socketService.leaveMatch(matchId);
    };
  }, [matchId, dispatch, addListener]);

  return {
    socket: socketService.getSocket(),
    isConnected: socketService.isSocketConnected(),
    joinMatch: (id) => socketService.joinMatch(id),
    leaveMatch: (id) => socketService.leaveMatch(id),
  };
};

export default useSocket;