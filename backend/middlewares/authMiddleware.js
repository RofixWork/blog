require("dotenv").config();
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.get("Authorization");
  let token;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Not Authorized..." });
  }

  try {
    token = authHeader.split(" ").at(1);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findOne({ _id: decoded.userId }).select("-password");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not Authorized..." });
  }

  if (!token) {
    return res.status(401).json({ message: "Not Authorized..." });
  }
});

module.exports = authMiddleware;
