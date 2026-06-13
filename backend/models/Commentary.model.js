const mongoose = require("mongoose");

const commentarySchema = new mongoose.Schema(
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
    ball: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ball",
    },
    overNumber: {
      type: Number,
    },
    ballNumber: {
      type: Number,
    },
    text: {
      type: String,
      required: true,
      maxlength: [500, "Commentary cannot exceed 500 characters"],
    },
    type: {
      type: String,
      enum: [
        "ball",
        "wicket",
        "boundary",
        "six",
        "over_complete",
        "innings_start",
        "innings_end",
        "match_start",
        "match_end",
        "milestone",
        "general",
      ],
      default: "ball",
    },
    isImportant: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

commentarySchema.index({ match: 1, innings: 1, createdAt: -1 });

module.exports = mongoose.model("Commentary", commentarySchema);