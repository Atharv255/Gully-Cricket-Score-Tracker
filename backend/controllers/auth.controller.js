const authService = require("../services/auth.service");
const ApiResponse = require("../utils/apiResponse");

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return ApiResponse.created(res, result, "Registration successful");
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return ApiResponse.success(res, result, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user._id);
      return ApiResponse.success(res, { user }, "Profile fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(
        req.user._id,
        currentPassword,
        newPassword
      );
      return ApiResponse.success(res, result, "Password changed successfully");
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      return ApiResponse.success(res, {}, "Logged out successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();