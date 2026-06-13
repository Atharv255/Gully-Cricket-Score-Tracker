const socketIO = require("socket.io");
const { handleMatchSockets } = require("../sockets/match.socket");
const { handleScoringSockets } = require("../sockets/scoring.socket");

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: function (origin, callback) {
        // Allow requests with no origin
        if (!origin) return callback(null, true);

        // Allow localhost and vercel deployments
        const allowed = [
          "http://localhost:5173",
          "http://localhost:3000",
          "https://gully-cricket-score-tracker.vercel.app",
          process.env.CLIENT_URL,
        ].filter(Boolean);

        if (origin.endsWith(".vercel.app") || allowed.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    socket.on("join_match", (matchId) => {
      socket.join(`match_${matchId}`);
      console.log(`👤 Client ${socket.id} joined match room: match_${matchId}`);
      socket.emit("joined_match", {
        matchId,
        message: "Successfully joined match room",
      });
    });

    socket.on("leave_match", (matchId) => {
      socket.leave(`match_${matchId}`);
      console.log(`👤 Client ${socket.id} left match room: match_${matchId}`);
    });

    socket.on("join_admin", (matchId) => {
      socket.join(`admin_${matchId}`);
      console.log(`👑 Admin ${socket.id} joined admin room: admin_${matchId}`);
    });

    handleMatchSockets(io, socket);
    handleScoringSockets(io, socket);

    socket.on("disconnect", (reason) => {
      console.log(`🔌 Client disconnected: ${socket.id} | Reason: ${reason}`);
    });

    socket.on("error", (error) => {
      console.error(`❌ Socket error from ${socket.id}:`, error);
    });
  });

  console.log("✅ Socket.IO initialized");
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};

module.exports = { initializeSocket, getIO };