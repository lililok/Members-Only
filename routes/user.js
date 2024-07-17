const express = require("express");
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require("../models/userSchema.js");

router.get('/', function(req, res, next) {
    res.redirect("/login");
  });

router.get("/login", (req, res) => {
    res.render("views/login");
  });

router.get("/sign-up", (req, res) => res.render("views/sign-up"));

router.post("/sign-up", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: hashedPassword,
      member: false,
      admin: false
    });

    const result = await user.save();

    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

module.exports = router;