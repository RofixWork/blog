const asyncHandler = require("express-async-handler");
const formidable = require("formidable");
const { StatusCodes } = require("http-status-codes");
const validator = require("validator/validator.js");
const Post = require("../models/Post");
const { v4: uuidv4 } = require("uuid");
const { copyFile } = require("fs");
const path = require("path");

// get all posts
const getAllPosts = asyncHandler(async (req, res, next) => {
  const { page } = req.query;
  // pagination
  const nPage = page || 1;
  const limit = 3;
  const skip = (nPage - 1) * limit;

  const posts = await Post.find({ userId: req.user._id })
    .sort("-updatedAt")
    .skip(skip)
    .limit(limit);

  const count = await Post.find({ userId: req.user._id }).countDocuments();

  if (!posts) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Not Exist any posts" });
  }

  res.status(StatusCodes.OK).json({ posts, nHits: count, limit });
});

// create post
const createPost = asyncHandler(async (req, res, next) => {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    const { title, description, slug, body } = fields;
    const errors = [];
    // check fields
    validator.isEmpty(title) && errors.push("Title is Required!");
    title && title.length < 6 && errors.push("title (min 6 chars)");
    title && title.length >= 80 && errors.push("title (max 80 chars)");
    validator.isEmpty(description) && errors.push("description is Required!");
    validator.isEmpty(slug) && errors.push("slug is Required!");
    validator.isEmpty(body.replace(/<(.|\n)*?>/g, "")) &&
      errors.push("body is Required!");

    if (Object.keys(files).length === 0 && files.constructor === Object) {
      errors.push("Image is Required");
    } else {
      const extensions = ["jpg", "png", "jpeg"];
      const extension = files.image.mimetype.split("/").at(1);

      if (!extensions.includes(extension)) {
        errors.push(`${extension} Not Supported`);
      } else {
        files.image.originalFilename = `${uuidv4()}.${extension}`;
      }
    }

    // check slug => exist or not
    const checkSlug = await Post.findOne({ slug });

    if (checkSlug) {
      errors.push("this slug/URL is exist...");
    }

    if (errors.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors });
    } else {
      const newPath = path.resolve(
        "frontend",
        "public",
        "images",
        `${files.image.originalFilename}`
      );

      copyFile(files.image.filepath, newPath, async (err) => {
        if (err) {
          console.log(err);
          return false;
        }
        const post = await Post.create({
          ...fields,
          userId: req.user._id,
          username: req.user.name,
          image: files.image.originalFilename,
        });

        res.status(StatusCodes.OK).json({ post });
      });
    }
  });
});

// get single post
const getSinglePost = asyncHandler(async (req, res, next) => {
  const { id: idPost } = req.params;
  const { _id } = req.user;

  const post = await Post.findOne({ _id: idPost, userId: _id });

  if (!post) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: `Not Exist any post by this id: ${idPost}` });
  }

  res.status(StatusCodes.OK).json({ post });
});

// delete post
const deletePost = asyncHandler(async (req, res, next) => {
  const { id: idPost } = req.params;
  const post = await Post.findOneAndDelete({ _id: idPost });

  if (!post) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: `Not Exist any post by this id: ${idPost}` });
  }

  res.status(StatusCodes.OK).json({ message: `Your post has been deleted` });
});

// edit post
const editPost = asyncHandler(async (req, res, next) => {
  const { id: idPost } = req.params;
  const { title, body, description } = req.body;
  const { _id } = req.user;

  const errors = [];
  // check fields
  validator.isEmpty(title) && errors.push("Title is Required!");
  title && title.length < 6 && errors.push("title (min 6 chars)");
  title && title.length >= 80 && errors.push("title (max 80 chars)");
  validator.isEmpty(description) && errors.push("description is Required!");
  validator.isEmpty(body.replace(/<(.|\n)*?>/g, "")) &&
    errors.push("body is Required!");

  if (errors.length) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors });
  }

  const post = await Post.findOneAndUpdate(
    { _id: idPost, userId: _id },
    { ...req.body },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ message: `Your post has been Edited` });
});

// get home posts
const getAllHomePosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({}).sort("-updatedAt");

  if (!posts) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Not Exist any posts" });
  }

  res.status(StatusCodes.OK).json({ posts });
});

const getSingleHomePost = asyncHandler(async (req, res, next) => {
  const { id: idPost } = req.params;

  const post = await Post.findOne({ slug: idPost });

  if (!post) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: `Not Exist any post by this id: ${idPost}` });
  }

  res.status(StatusCodes.OK).json({ post });
});

module.exports = {
  createPost,
  getAllPosts,
  deletePost,
  getSinglePost,
  editPost,
  getAllHomePosts,
  getSingleHomePost,
};
