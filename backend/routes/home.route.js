const express = require("express");
const router = express.Router();

const {
  getAllHomePosts,
  getSingleHomePost,
} = require("../controllers/post.controller");
router.route("/").get(getAllHomePosts);
router.route("/:id").get(getSingleHomePost);
module.exports = router;
