const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");

var indexRouter = require('./routes/index.js');

const app = express();
app.set("views", __dirname);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));


app.use('/', indexRouter);

app.listen(3000, () => console.log("app listening on port 3000!"));
