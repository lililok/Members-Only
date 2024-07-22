const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

const User = require("../models/userSchema.js");

exports.login = asyncHandler(async (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/login"
    })(req, res, next);
})

exports.home = asyncHandler(async (req, res, next) => {
    if (req.isAuthenticated()) {
        const user = await User.findById(req.user.id);
        res.render("views/home", { user });
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

exports.join = asyncHandler(async (req, res, next) => {

})

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));
  
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});