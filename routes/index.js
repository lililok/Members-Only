const express = require("express");

const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

const router = express.Router();

router.get('/', user_controller.home);
router.get('/login', (req, res) => res.render("views/login"));
router.post("/login", user_controller.login)

router.get('/home', user_controller.home)

router.get("/sign-up", (req, res) => res.render("views/sign-up"));
router.post("/sign-up", user_controller.signup);

router.get("/join-the-club", (req, res) => res.render("views/join-the-club", {wrong: false}));
router.post("/join-the-club", user_controller.join);

router.get("/new-message", (req, res) => res.render("views/new-message"));
router.post("/new-message", message_controller.message_post);

router.post('/message_delete', message_controller.message_delete);

router.get("/profile", user_controller.profile);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;