const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  createComment,
  getAllComments,
} = require("../controllers/comment.controller");
router.route("/").post(auth, createComment);
router.route("/:id").get(getAllComments);

module.exports = router;
