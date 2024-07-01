const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require("./models");

// Routers
const postsRouter = require("./routes/Posts");
app.use("/posts", postsRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);
const applicationsRouter = require("./routes/Applications");
app.use("/applications", applicationsRouter);
const studygroupsRouter = require("./routes/StudyGroups");
app.use("/studygroups", studygroupsRouter);

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
