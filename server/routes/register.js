const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../database/Schema").User,
  bcrypt = require("bcryptjs");

router.post("/", (req, res) => {
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        email: req.body.email,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("User Created");
    }
  });
});
module.exports = router;
