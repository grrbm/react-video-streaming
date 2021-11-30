const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../database/Schema").User,
  bcrypt = require("bcryptjs");

router.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
        console.log(req.user);
      });
    }
  })(req, res, next);
});

module.exports = router;
