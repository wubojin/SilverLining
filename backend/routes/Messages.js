const express = require("express");
const router = express.Router();
const { Messages } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/:studygroupId", async (req, res) => {
  const studygroupId = req.params.studygroupId;
  const messages = await Messages.findAll({
    where: { StudyGroupId: studygroupId },
  });
  res.json(messages);
});

router.post("/", validateToken, async (req, res) => {
  const { messageBody, username, StudyGroupId } = req.body;
  const message = await Messages.create({
    messageBody,
    username,
    StudyGroupId,
  });
  res.json(message);
});

module.exports = router;
