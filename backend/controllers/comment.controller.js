const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const validator = require("validator/validator");
const Comment = require("../models/Comment");
const createComment = asyncHandler(async (req, res, next) => {
  const { comment } = req.body;
  const { _id, name } = req.user;
  if (validator.isEmpty(comment)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Comment is Required!" });
  }

  const createComment = await Comment.create({
    ...req.body,
    username: name,
    userId: _id,
  });

  res.status(StatusCodes.OK).json({ createComment });
});

const getAllComments = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const comments = await Comment.find({ postId: id });

  res.status(StatusCodes.OK).json(comments);
});

module.exports = { createComment, getAllComments };
