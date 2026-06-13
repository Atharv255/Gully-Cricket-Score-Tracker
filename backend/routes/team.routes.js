const express = require("express");
const router = express.Router();
const teamController = require("../controllers/team.controller");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const { createTeamValidation } = require("../validations/team.validation");
const { validate } = require("../middleware/validate.middleware");

// Public
router.get("/", teamController.getAllTeams);
router.get("/:teamId", teamController.getTeamById);

// Admin
router.post(
  "/",
  protect,
  adminOnly,
  createTeamValidation,
  validate,
  teamController.createTeam
);
router.put(
  "/:teamId",
  protect,
  adminOnly,
  teamController.updateTeam
);
router.delete(
  "/:teamId",
  protect,
  adminOnly,
  teamController.deleteTeam
);
router.post(
  "/:teamId/players",
  protect,
  adminOnly,
  teamController.addPlayerToTeam
);

module.exports = router;