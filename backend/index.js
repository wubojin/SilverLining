const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3001;

require("dotenv").config();

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
const messagesRouter = require("./routes/Messages");
app.use("/messages", messagesRouter);

db.sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
