const express = require("express");
const router = express.Router();
const matchController = require("../controllers/match.controller");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const {
  createMatchValidation,
  matchIdValidation,
} = require("../validations/match.validation");
const { validate } = require("../middleware/validate.middleware");

// Public routes
router.get("/", matchController.getAllMatches);
router.get("/share/:token", matchController.getMatchByShareToken);
router.get("/:matchId", matchIdValidation, validate, matchController.getMatchById);
router.get(
  "/:matchId/innings/current",
  matchIdValidation,
  validate,
  matchController.getCurrentInnings
);

// Admin routes
router.post(
  "/",
  protect,
  adminOnly,
  createMatchValidation,
  validate,
  matchController.createMatch
);

router.post(
  "/:matchId/start",
  protect,
  adminOnly,
  matchIdValidation,
  validate,
  matchController.startMatch
);

router.patch(
  "/:matchId",
  protect,
  adminOnly,
  matchIdValidation,
  validate,
  matchController.updateMatch
);

router.delete(
  "/:matchId",
  protect,
  adminOnly,
  matchIdValidation,
  validate,
  matchController.deleteMatch
);

module.exports = router;