const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  createPost,
  getAllPosts,
  deletePost,
  getSinglePost,
  editPost,
} = require("../controllers/post.controller");
router.route("/create").post(auth, createPost);
router.route("/").get(auth, getAllPosts);
router.route("/delete/:id").delete(auth, deletePost);
router.route("/:id").get(auth, getSinglePost);
router.route("/edit/:id").patch(auth, editPost);
module.exports = router;
