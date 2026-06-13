const express = require("express");
const router = express.Router();
const commentaryController = require("../controllers/commentary.controller");

router.get("/match/:matchId", commentaryController.getMatchCommentary);
router.get(
  "/innings/:inningsId",
  commentaryController.getInningsCommentary
);

module.exports = router;