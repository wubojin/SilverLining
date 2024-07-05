const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "frontend")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
