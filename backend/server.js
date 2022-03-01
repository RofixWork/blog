require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connect");
const cors = require("cors");
const app = express();
const routerUser = require("./routes/auth.route");
const routerPosts = require("./routes/post.route");
const routerSetting = require("./routes/user.route");
const routerHome = require("./routes/home.route");
const routerComment = require("./routes/comment.route");
const path = require("path");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.use("/api/v1/user", routerUser);
app.use("/api/v1/setting", routerSetting);
app.use("/api/v1/post", routerPosts);
app.use("/api/v1/home", routerHome);
app.use("/api/v1/comment", routerComment);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve("frontend", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve("frontend", "build", "index.html"));
  });
}

app.use(require("./middlewares/not-found"));
app.use(require("./middlewares/errorHandler"));
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, console.log(`server litening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
