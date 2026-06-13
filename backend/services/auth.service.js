const User = require("../models/User.model");
const { generateToken } = require("../utils/generateToken");
const ApiError = require("../utils/apiError");

class AuthService {
  async register(userData) {
    const { username, email, password, role, adminSecretKey } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ApiError(400, "Email already registered");
      }
      throw new ApiError(400, "Username already taken");
    }

    // Validate admin secret key
    if (role === "admin") {
      if (!adminSecretKey) {
        throw new ApiError(400, "Admin secret key is required for admin registration");
      }
      if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
        throw new ApiError(403, "Invalid admin secret key");
      }
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role || "viewer",
    });

    const token = generateToken({ id: user._id, role: user.role });

    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async login(email, password) {
    // Find user with password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.isActive) {
      throw new ApiError(401, "Account is deactivated. Contact admin.");
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken({ id: user._id, role: user.role });

    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
      token,
    };
  }

  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(400, "Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    return { message: "Password changed successfully" };
  }
}

module.exports = new AuthService();