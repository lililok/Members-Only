const express = require("express");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/userSchema.js");

const router = express.Router();

router.get('/', function(req, res, next) {
    res.redirect("/login");
  });

router.get("/login", (req, res) => {
    res.render("views/login");
  });

  router.get("/home", (req, res) => {
    if (req.isAuthenticated()) {
      res.render("views/home");
    } else {
      res.redirect("/login");
    }
  });

  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/home",
      failureRedirect: "/login"
    })
  );

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

passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        };
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect password" })
        }
        return done(null, user);
      } catch(err) {
        return done(err);
      };
    })
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch(err) {
      done(err);
    };
  });

  router.get("/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });


  
module.exports = router;