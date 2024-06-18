const express = require("express");
const router = express.Router();
const { Applications } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const listOfApplications = await Applications.findAll();
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
