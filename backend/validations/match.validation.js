const { body, param } = require("express-validator");

const createMatchValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Match title is required")
    .isLength({ max: 100 })
    .withMessage("Match title cannot exceed 100 characters"),

  body("groundName")
    .trim()
    .notEmpty()
    .withMessage("Ground name is required")
    .isLength({ max: 100 })
    .withMessage("Ground name cannot exceed 100 characters"),

  body("matchDate")
    .notEmpty()
    .withMessage("Match date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("totalOvers")
    .notEmpty()
    .withMessage("Total overs is required")
    .isInt({ min: 1 })
    .withMessage("Total overs must be at least 1"),

  body("teamA.name").trim().notEmpty().withMessage("Team A name is required"),

  body("teamA.captain")
    .trim()
    .notEmpty()
    .withMessage("Team A captain is required"),

  body("teamA.players")
    .isArray({ min: 2 })
    .withMessage("Team A must have at least 2 players"),

  body("teamB.name").trim().notEmpty().withMessage("Team B name is required"),

  body("teamB.captain")
    .trim()
    .notEmpty()
    .withMessage("Team B captain is required"),

  body("teamB.players")
    .isArray({ min: 2 })
    .withMessage("Team B must have at least 2 players"),

  body("toss.winner").trim().notEmpty().withMessage("Toss winner is required"),

  body("toss.decision")
    .notEmpty()
    .withMessage("Toss decision is required")
    .isIn(["bat", "bowl"])
    .withMessage("Toss decision must be bat or bowl"),
];

const matchIdValidation = [
  param("matchId")
    .notEmpty()
    .withMessage("Match ID is required")
    .isMongoId()
    .withMessage("Invalid match ID"),
];

module.exports = { createMatchValidation, matchIdValidation };
