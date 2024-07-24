const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const { Pool } = require("pg");

var UserRouter = require('./routes/userRoutes.js');

const app = express();
app.set("views", __dirname);
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use('/', UserRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));
