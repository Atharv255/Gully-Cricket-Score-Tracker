const { body } = require("express-validator");

const createPlayerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Player name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Player name must be between 2 and 50 characters"),

  body("role")
    .optional()
    .isIn(["batsman", "bowler", "all_rounder", "wicket_keeper", "unknown"])
    .withMessage("Invalid player role"),
];

module.exports = { createPlayerValidation };