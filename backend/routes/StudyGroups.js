const express = require("express");
const router = express.Router();
const { StudyGroups } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const listOfStudyGroups = await StudyGroups.findAll();
  res.json({ listOfStudyGroups });
});

router.post("/", validateToken, async (req, res) => {
  const studygroup = req.body;
  studygroup.username = req.user.username;
  studygroup.UserId = req.user.id;
  await StudyGroups.create(studygroup);
  res.json(studygroup);
});

module.exports = router;
