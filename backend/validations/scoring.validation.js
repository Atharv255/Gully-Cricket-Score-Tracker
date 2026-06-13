const { body, param } = require("express-validator");
const { EXTRA_TYPES, WICKET_TYPES } = require("../config/constants");

const recordBallValidation = [
  param("matchId")
    .notEmpty()
    .withMessage("Match ID is required")
    .isMongoId()
    .withMessage("Invalid match ID"),

  body("runs")
    .notEmpty()
    .withMessage("Runs is required")
    .isInt({ min: 0, max: 6 })
    .withMessage("Runs must be between 0 and 6"),

  body("extraType")
    .optional()
    .isIn(Object.values(EXTRA_TYPES))
    .withMessage("Invalid extra type"),

  body("extraRuns")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Extra runs must be 0 or more"),

  body("isWicket")
    .optional()
    .isBoolean()
    .withMessage("isWicket must be a boolean"),

  body("wicketType")
    .optional()
    .isIn(Object.values(WICKET_TYPES))
    .withMessage("Invalid wicket type"),

  body("strikerId")
    .notEmpty()
    .withMessage("Striker ID is required")
    .isMongoId()
    .withMessage("Invalid striker ID"),

  body("nonStrikerId")
    .notEmpty()
    .withMessage("Non-striker ID is required")
    .isMongoId()
    .withMessage("Invalid non-striker ID"),

  body("bowlerId")
    .notEmpty()
    .withMessage("Bowler ID is required")
    .isMongoId()
    .withMessage("Invalid bowler ID"),
];

const selectBatsmanValidation = [
  param("matchId").isMongoId().withMessage("Invalid match ID"),
  body("playerId").isMongoId().withMessage("Invalid player ID"),
  body("playerName").notEmpty().withMessage("Player name is required"),
];

const selectBowlerValidation = [
  param("matchId").isMongoId().withMessage("Invalid match ID"),
  body("playerId").isMongoId().withMessage("Invalid player ID"),
  body("playerName").notEmpty().withMessage("Player name is required"),
];

module.exports = {
  recordBallValidation,
  selectBatsmanValidation,
  selectBowlerValidation,
};