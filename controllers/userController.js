const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const pool = require('../db/pool.js');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

exports.login = asyncHandler(async (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/login"
    })(req, res, next);
})

exports.home = asyncHandler(async (req, res, next) => {
    if (req.isAuthenticated()) {
        const { rows } = await pool.query("SELECT * FROM user_data WHERE id = $1", [req.user.id]);
        const user = rows[0];
        res.render("views/home", { user });
    } else {
        res.redirect("/login");
    }
})

exports.signup = asyncHandler(async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await pool.query("INSERT INTO user_data (firstname, lastname, username, password, member, admin) VALUES ($1, $2, $3, $4, $5, $6)", [
            req.body.firstname,
            req.body.lastname,
            req.body.username,
            hashedPassword,
            false,
            false
        ]);
        res.redirect("/");
    } catch (err) {
        return next(err);
    }
})

exports.join = asyncHandler(async (req, res, next) => {
    try {
        if (req.body.passcode === process.env.PASSCODE) {
            await pool.query("UPDATE user_data SET member = $1 WHERE id = $2", [
                true,
                req.user.id
            ]);
            res.redirect("/home");
        } else {
            res.render("views/join-the-club", {wrong: true});
        }
    } catch (err) {
        return next(err);
    }
})

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM user_data WHERE username = $1", [username]);
        const user = rows[0];
        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return done(null, false, { message: "Incorrect password" });
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
      const { rows } = await pool.query("SELECT * FROM user_data WHERE id = $1", [id]);
      const user = rows[0];
  
      done(null, user);
    } catch(err) {
      done(err);
    };
  });
  