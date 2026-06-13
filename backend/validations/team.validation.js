const { body } = require("express-validator");

const createTeamValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Team name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Team name must be between 2 and 50 characters"),

  body("captain")
    .trim()
    .notEmpty()
    .withMessage("Captain name is required"),

  body("shortName")
    .optional()
    .trim()
    .isLength({ max: 5 })
    .withMessage("Short name cannot exceed 5 characters"),
];

module.exports = { createTeamValidation };