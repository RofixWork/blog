const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err) {
    res.status(res.statusCode);
    res.json({ msg: err.message });
  }
};

module.exports = errorHandlerMiddleware;
