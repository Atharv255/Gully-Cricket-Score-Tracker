import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "https://gully-cricket-score-tracker.onrender.com";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentMatchId = null;
  }

  connect() {
    if (this.socket?.connected) return this.socket;

    this.socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      withCredentials: true,
    });

    this.socket.on("connect", () => {
      console.log("🔌 Socket connected:", this.socket.id);
      this.isConnected = true;

      if (this.currentMatchId) {
        this.joinMatch(this.currentMatchId);
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log("✅ Socket reconnected after", attemptNumber, "attempts");
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentMatchId = null;
    }
  }

  joinMatch(matchId) {
    if (!this.socket) this.connect();
    this.currentMatchId = matchId;
    this.socket.emit("join_match", matchId);
    console.log("🏏 Joined match room:", matchId);
  }

  leaveMatch(matchId) {
    if (this.socket) {
      this.socket.emit("leave_match", matchId);
      this.currentMatchId = null;
    }
  }

  joinAdmin(matchId) {
    if (!this.socket) this.connect();
    this.socket.emit("join_admin", matchId);
  }

  requestLiveScore(matchId) {
    if (this.socket) {
      this.socket.emit("request_live_score", { matchId });
    }
  }

  on(event, callback) {
    if (!this.socket) this.connect();
    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.socket?.connected || false;
  }
}

export default new SocketService();