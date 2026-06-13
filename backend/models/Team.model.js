const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      minlength: [2, "Team name must be at least 2 characters"],
      maxlength: [50, "Team name cannot exceed 50 characters"],
    },
    shortName: {
      type: String,
      trim: true,
      maxlength: [5, "Short name cannot exceed 5 characters"],
      uppercase: true,
    },
    captain: {
      type: String,
      required: [true, "Captain name is required"],
      trim: true,
    },
    players: [
      {
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Player",
          required: true,
        },
        isCaptain: {
          type: Boolean,
          default: false,
        },
        isWicketKeeper: {
          type: Boolean,
          default: false,
        },
      },
    ],
    logoUrl: {
      type: String,
      default: "",
    },
    primaryColor: {
      type: String,
      default: "#1a56db",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Team", teamSchema);