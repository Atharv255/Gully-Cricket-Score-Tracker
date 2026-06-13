const express = require("express");
const router = express.Router();
const playerController = require("../controllers/player.controller");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const { createPlayerValidation } = require("../validations/player.validation");
const { validate } = require("../middleware/validate.middleware");

// Public
router.get("/", playerController.getAllPlayers);
router.get("/:playerId", playerController.getPlayerById);

// Admin
router.post(
  "/",
  protect,
  adminOnly,
  createPlayerValidation,
  validate,
  playerController.createPlayer
);
router.put(
  "/:playerId",
  protect,
  adminOnly,
  playerController.updatePlayer
);
router.delete(
  "/:playerId",
  protect,
  adminOnly,
  playerController.deletePlayer
);

module.exports = router;