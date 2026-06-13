const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const {
  registerValidation,
  loginValidation,
} = require("../validations/auth.validation");
const { validate } = require("../middleware/validate.middleware");

// Public routes
router.post("/register", registerValidation, validate, authController.register);
router.post("/login", loginValidation, validate, authController.login);

// Protected routes
router.get("/profile", protect, authController.getProfile);
router.post("/logout", protect, authController.logout);
router.patch("/change-password", protect, authController.changePassword);

module.exports = router;