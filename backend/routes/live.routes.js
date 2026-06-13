const express = require("express");
const router = express.Router();
const liveController = require("../controllers/live.controller");

router.get("/matches", liveController.getLiveMatches);
router.get("/upcoming", liveController.getUpcomingMatches);
router.get("/completed", liveController.getCompletedMatches);
router.get("/:matchId/score", liveController.getLiveScore);

module.exports = router;