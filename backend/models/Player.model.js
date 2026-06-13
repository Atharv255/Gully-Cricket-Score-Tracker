const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Player name is required"],
      trim: true,
      minlength: [2, "Player name must be at least 2 characters"],
      maxlength: [50, "Player name cannot exceed 50 characters"],
    },
    jerseyNumber: {
      type: Number,
      min: 0,
      max: 999,
    },
    role: {
      type: String,
      enum: ["batsman", "bowler", "all_rounder", "wicket_keeper", "unknown"],
      default: "unknown",
    },
    battingStyle: {
      type: String,
      enum: ["right_hand", "left_hand", ""],
      default: "",
    },
    bowlingStyle: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Player", playerSchema);