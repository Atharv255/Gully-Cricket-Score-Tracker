const mongoose = require("mongoose");
const {
  MATCH_STATUS,
  TOSS_DECISIONS,
  RESULT_TYPES,
} = require("../config/constants");

const tossSchema = new mongoose.Schema({
  winner: {
    type: String,
    required: true,
  },
  winnerTeamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  decision: {
    type: String,
    enum: Object.values(TOSS_DECISIONS),
    required: true,
  },
});

const resultSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: Object.values(RESULT_TYPES),
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  winnerName: {
    type: String,
  },
  margin: {
    type: Number,
  },
  marginType: {
    type: String,
    enum: ["runs", "wickets", ""],
    default: "",
  },
  description: {
    type: String,
  },
  manOfTheMatch: {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    playerName: {
      type: String,
    },
    teamName: {
      type: String,
    },
  },
});

const matchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Match title is required"],
      trim: true,
      maxlength: [100, "Match title cannot exceed 100 characters"],
    },
    groundName: {
      type: String,
      required: [true, "Ground name is required"],
      trim: true,
      maxlength: [100, "Ground name cannot exceed 100 characters"],
    },
    matchDate: {
      type: Date,
      required: [true, "Match date is required"],
    },
    totalOvers: {
      type: Number,
      required: [true, "Total overs is required"],
      min: [1, "Minimum 1 over"],
      // No max limit - admin can set any number of overs
    },
    teamA: {
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
      },
      name: String,
    },
    teamB: {
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
      },
      name: String,
    },
    toss: tossSchema,
    innings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Innings",
      },
    ],
    currentInnings: {
      type: Number,
      default: 1,
      enum: [1, 2],
    },
    status: {
      type: String,
      enum: Object.values(MATCH_STATUS),
      default: MATCH_STATUS.UPCOMING,
    },
    result: resultSchema,
    battingFirst: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    bowlingFirst: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shareToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate share token before saving - Mongoose 8 compatible
matchSchema.pre("save", async function () {
  if (!this.shareToken) {
    this.shareToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }
});

module.exports = mongoose.model("Match", matchSchema);
