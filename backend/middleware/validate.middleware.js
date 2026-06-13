const { validationResult } = require("express-validator");
const ApiResponse = require("../utils/apiResponse");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return ApiResponse.error(
      res,
      "Validation failed",
      422,
      extractedErrors
    );
  }

  next();
};

module.exports = { validate };