const express = require("express");

const user_controller = require("../controllers/userController");

const router = express.Router();

router.get('/', (req, res) => res.render("views/login"));
router.get('/login', (req, res) => res.render("views/login"));
router.post("/login", user_controller.login)

router.get('/home', user_controller.home)

router.get("/sign-up", (req, res) => res.render("views/sign-up"));
router.post("/sign-up", user_controller.signup);

router.get("/join-the-club", (req, res) => res.render("views/join-the-club"));
router.post("/join-the-club", user_controller.join);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;