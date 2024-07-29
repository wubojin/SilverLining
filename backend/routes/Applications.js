const express = require("express");
const router = express.Router();
const { Applications, Posts } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  const listOfApplications = await Applications.findAll({
    where: { PostId: postId },
  });
  res.json(listOfApplications);
});

router.post("/", validateToken, async (req, res) => {
  const application = req.body;
  application.username = req.user.username;
  application.UserId = req.user.id;
  application.PostId = req.body.PostId;
  await Applications.create(application);
  res.json(application);
});

module.exports = router;
