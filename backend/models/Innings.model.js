const mongoose = require("mongoose");
const { INNINGS_STATUS, PLAYER_STATUS } = require("../config/constants");

const batterSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  playerName: {
    type: String,
    required: true,
  },
  runs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  fours: { type: Number, default: 0 },
  sixes: { type: Number, default: 0 },
  status: {
    type: String,
    enum: Object.values(PLAYER_STATUS),
    default: PLAYER_STATUS.YET_TO_BAT,
  },
  dismissalInfo: {
    type: String,
    default: "",
  },
  dismissedBy: {
    bowler: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
    bowlerName: { type: String, default: "" },
    fielder: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
    fielderName: { type: String, default: "" },
  },
  isStriker: {
    type: Boolean,
    default: false,
  },
  battingOrder: {
    type: Number,
  },
});

const bowlerSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  playerName: {
    type: String,
    required: true,
  },
  overs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  maidens: { type: Number, default: 0 },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  wides: { type: Number, default: 0 },
  noBalls: { type: Number, default: 0 },
  currentOverRuns: { type: Number, default: 0 },
  isCurrentBowler: {
    type: Boolean,
    default: false,
  },
});

const inningsSchema = new mongoose.Schema(
  {
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    inningsNumber: {
      type: Number,
      required: true,
      enum: [1, 2],
    },
    battingTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    battingTeamName: {
      type: String,
    },
    bowlingTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    bowlingTeamName: {
      type: String,
    },
    totalRuns: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    totalOvers: { type: Number, required: true },
    oversCompleted: { type: Number, default: 0 },
    ballsInCurrentOver: { type: Number, default: 0 },
    extras: {
      total: { type: Number, default: 0 },
      wides: { type: Number, default: 0 },
      noBalls: { type: Number, default: 0 },
      byes: { type: Number, default: 0 },
      legByes: { type: Number, default: 0 },
    },
    batters: [batterSchema],
    bowlers: [bowlerSchema],
    currentStriker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    currentNonStriker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    currentBowler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    lastBowler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    partnership: {
      runs: { type: Number, default: 0 },
      balls: { type: Number, default: 0 },
      batter1: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
      batter2: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
    },
    lastWicket: {
      playerName: { type: String, default: "" },
      runs: { type: Number, default: 0 },
      balls: { type: Number, default: 0 },
      dismissalInfo: { type: String, default: "" },
      totalScoreAtFall: { type: String, default: "" },
      overAtFall: { type: String, default: "" },
      fielderName: { type: String, default: "" },
    },
    recentBalls: [
      {
        display: { type: String },
        runs: { type: Number },
        isWicket: { type: Boolean, default: false },
        isExtra: { type: Boolean, default: false },
        extraType: { type: String },
        overNumber: { type: Number },
        ballNumber: { type: Number },
      },
    ],
    target: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(INNINGS_STATUS),
      default: INNINGS_STATUS.IN_PROGRESS,
    },
    balls: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ball",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for run rate
inningsSchema.virtual("runRate").get(function () {
  const totalBalls = this.oversCompleted * 6 + (this.ballsInCurrentOver || 0);
  if (totalBalls === 0) return 0;
  return ((this.totalRuns / totalBalls) * 6).toFixed(2);
});

// Virtual for required run rate (2nd innings)
inningsSchema.virtual("requiredRunRate").get(function () {
  if (!this.target) return null;
  const runsRequired = this.target - this.totalRuns;
  const totalBalls = this.totalOvers * 6;
  const ballsBowled =
    this.oversCompleted * 6 + (this.ballsInCurrentOver || 0);
  const ballsRemaining = totalBalls - ballsBowled;

  if (ballsRemaining <= 0) return 0;
  return ((runsRequired / ballsRemaining) * 6).toFixed(2);
});

// Virtual for overs display (e.g., 17.3)
inningsSchema.virtual("oversDisplay").get(function () {
  return `${this.oversCompleted}.${this.ballsInCurrentOver || 0}`;
});

module.exports = mongoose.model("Innings", inningsSchema);