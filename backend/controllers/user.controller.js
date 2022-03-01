const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Post = require("../models/Post");
const validator = require("validator/validator");
const { StatusCodes } = require("http-status-codes");
const changeName = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { name } = req.body;
  const errors = [];

  validator.isEmpty(name) && errors.push("Name is Required!");
  name && name.trim().length < 3 && errors.push("Name (min 3 chars)");

  const user = await User.findOne({ _id }).select("-password");

  if (!user) {
    errors.push("This User not Exist...");
  }

  if (errors.length) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors });
  }

  const updateUserName = await User.findOneAndUpdate(
    { _id },
    { name },
    { new: true, runValidators: true }
  );

  await Post.updateMany(
    { userId: _id },
    {
      $set: {
        username: name,
      },
    },
    { new: true, runValidators: true }
  );

  const token = updateUserName.createJWT();

  res
    .status(StatusCodes.OK)
    .json({ user: { name: updateUserName.name }, token });
});

module.exports = { changeName };
