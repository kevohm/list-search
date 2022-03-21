const CustomError = require("../error/customError");
const Errors = require("../error/customError");
const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).json({ success: false, data: err.message});
        next();
    }
    return res
      .status(500)
      .json({ success: false, data: "Internal Server Error" });

}

module.exports = errorHandler;