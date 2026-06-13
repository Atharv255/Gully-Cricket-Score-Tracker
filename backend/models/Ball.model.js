const mongoose = require("mongoose");
const { EXTRA_TYPES, WICKET_TYPES } = require("../config/constants");

const ballSchema = new mongoose.Schema(
  {
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    innings: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Innings",
      required: true,
    },
    inningsNumber: {
      type: Number,
      required: true,
      enum: [1, 2],
    },
    overNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    ballNumber: {
      type: Number,
      required: true,
      min: 0, // ← Changed from 1 to 0 (extras can be ball 0)
    },
    displayOver: {
      type: String,
    },
    runs: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
      default: 0,
    },
    totalRuns: {
      type: Number,
      default: 0,
    },
    isExtra: {
      type: Boolean,
      default: false,
    },
    extraType: {
      type: String,
      enum: Object.values(EXTRA_TYPES),
      default: EXTRA_TYPES.NONE,
    },
    extraRuns: {
      type: Number,
      default: 0,
    },
    isWicket: {
      type: Boolean,
      default: false,
    },
    wicketType: {
      type: String,
      enum: Object.values(WICKET_TYPES),
      default: WICKET_TYPES.NONE,
    },
    isValidBall: {
      type: Boolean,
      default: true,
    },
    striker: {
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true,
      },
      playerName: { type: String, required: true },
    },
    nonStriker: {
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true,
      },
      playerName: { type: String, required: true },
    },
    bowler: {
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true,
      },
      playerName: { type: String, required: true },
    },
    dismissedBatter: {
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
      playerName: { type: String },
    },
    fielder: {
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
      playerName: { type: String },
    },
    commentary: {
      type: String,
      default: "",
    },
    displayValue: {
      type: String,
    },
    scoreSnapshot: {
      totalRuns: { type: Number },
      wickets: { type: Number },
      overs: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save to set display values - Mongoose 8 compatible
ballSchema.pre("save", async function () {
  this.displayOver = `${this.overNumber}.${this.ballNumber}`;

  if (this.isWicket) {
    this.displayValue = "W";
  } else if (this.isExtra) {
    if (this.extraType === "wide") this.displayValue = "Wd";
    else if (this.extraType === "no_ball") this.displayValue = "Nb";
    else if (this.extraType === "bye")
      this.displayValue = `${this.totalRuns}b`;
    else if (this.extraType === "leg_bye")
      this.displayValue = `${this.totalRuns}lb`;
    else this.displayValue = `${this.totalRuns}`;
  } else {
    this.displayValue = `${this.runs}`;
  }

  this.totalRuns = this.runs + this.extraRuns;
});

module.exports = mongoose.model("Ball", ballSchema);