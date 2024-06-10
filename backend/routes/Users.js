const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await Users.findOne({ where: { username: username } });

  if (existingUser) {
    return res.json({ error: "Username is already taken" });
  } else {
    bcrypt.hash(password, 10).then((hash) => {
      Users.create({
        username: username,
        password: hash,
      }).then(() => {
        res.json("SUCCESS!");
      });
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username: username } });

  if (!user) return res.json({ error: "User doesn't exist!" });

  bcrypt.compare(password, user.password).then(async (match) => {
    if (!match)
      return res.json({ error: "Wrong username and password combination" });

    const accessToken = sign(
      { username: user.username, id: user.id },
      "importantsecret"
    );

    res.json({ token: accessToken, username: username, id: user.id });
  });
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;
  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  res.json(basicInfo);
});

module.exports = router;
