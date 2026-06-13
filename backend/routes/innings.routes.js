const express = require("express");
const router = express.Router();
const inningsController = require("../controllers/innings.controller");

router.get("/:inningsId", inningsController.getInningsById);
router.get("/:inningsId/balls", inningsController.getInningsBalls);
router.get("/:inningsId/overs", inningsController.getOverSummary);
router.get("/:inningsId/scorecard", inningsController.getScorecard);

module.exports = router;