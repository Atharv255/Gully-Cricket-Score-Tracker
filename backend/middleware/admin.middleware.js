const ApiResponse = require("../utils/apiResponse");

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return ApiResponse.error(res, "Authentication required.", 401);
  }

  if (req.user.role !== "admin") {
    return ApiResponse.error(
      res,
      "Access denied. Admin privileges required.",
      403
    );
  }

  next();
};

module.exports = { adminOnly };