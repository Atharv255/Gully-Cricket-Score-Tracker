const express = require("express");
const router = express.Router();
const scoringController = require("../controllers/scoring.controller");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const {
  recordBallValidation,
  selectBatsmanValidation,
  selectBowlerValidation,
} = require("../validations/scoring.validation");
const { validate } = require("../middleware/validate.middleware");

// All scoring routes are admin only
router.post(
  "/:matchId/ball",
  protect,
  adminOnly,
  recordBallValidation,
  validate,
  scoringController.recordBall
);

router.post(
  "/:matchId/batsman",
  protect,
  adminOnly,
  selectBatsmanValidation,
  validate,
  scoringController.selectNewBatsman
);

router.post(
  "/:matchId/bowler",
  protect,
  adminOnly,
  selectBowlerValidation,
  validate,
  scoringController.selectNewBowler
);

router.post(
  "/:matchId/undo",
  protect,
  adminOnly,
  scoringController.undoLastBall
);

router.post(
  "/:matchId/end-innings",
  protect,
  adminOnly,
  scoringController.endInnings
);

router.post(
  "/:matchId/start-second-innings",
  protect,
  adminOnly,
  scoringController.startSecondInnings
);

router.post(
  "/:matchId/end-match",
  protect,
  adminOnly,
  scoringController.endMatch
);

module.exports = router;