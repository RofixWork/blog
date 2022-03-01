const notFoundMiddleware = (req, res, next) => {
  res.status(404).json({ success: false, message: "This route no exist" });
};

module.exports = notFoundMiddleware;
