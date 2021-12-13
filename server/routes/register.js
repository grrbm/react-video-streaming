const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../database/Schema").User,
  bcrypt = require("bcryptjs"),
  shortid = require("shortid");

router.post("/", (req, res) => {
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.status(401).send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        email: req.body.email,
        password: hashedPassword,
        stream_key: shortid.generate(),
        username: req.body.username,
      });
      await newUser.save();
      res.status(200).send("User Created");
    }
  });
});
module.exports = router;
