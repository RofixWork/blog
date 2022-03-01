const express = require("express");
const { changeName } = require("../controllers/user.controller");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
router.route("/changeName").patch(auth, changeName);

module.exports = router;
