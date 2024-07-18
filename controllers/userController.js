const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

exports.login = asyncHandler(async (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/login"
      })
})

exports.home = asyncHandler(async (req, res, next) => {
    if (req.isAuthenticated()) {
        res.render("views/home", user);
      } else {
        res.redirect("/login");
      }
})

exports.signup = asyncHandler(async (req, res, next) => {
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
})