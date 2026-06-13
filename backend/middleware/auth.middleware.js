const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return ApiResponse.error(
        res,
        "Access denied. No token provided.",
        401
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return ApiResponse.error(res, "User not found.", 401);
      }

      if (!user.isActive) {
        return ApiResponse.error(res, "Account is deactivated.", 401);
      }

      req.user = user;
      next();
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return ApiResponse.error(res, "Token expired. Please login again.", 401);
      }
      return ApiResponse.error(res, "Invalid token.", 401);
    }
  } catch (error) {
    return ApiResponse.error(res, "Authentication failed.", 500);
  }
};

module.exports = { protect };